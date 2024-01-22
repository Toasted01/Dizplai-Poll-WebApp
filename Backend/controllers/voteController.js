const fs = require("fs");
const path = require("path");

const votesFilePath = path.join(__dirname, "../data/votes.json");
const lockFilePath = path.join(__dirname, "../data/votes.lock"); //only exists if a user is writing to votes.json

/**
 * Reads votes data from the file and returns it.
 * @returns {Array|Object} - Array of votes
 */
const getVotesFromFile = () => {
  try {
    const votesData = fs.readFileSync(votesFilePath, "utf8");
    return JSON.parse(votesData);
  } catch (error) {
    console.error("Error reading votes file:", error);
    return [];
  }
};

/**
 * checks to see if there is a votes.lock file present in Backend/data
 * if true then the file is locked and cant be written to until the file is unlocked.
 * if false it will create the .lock file in order to lock the file for a user write
 *
 * called before writing to votes.json in voteController.postVote()
 * @returns {boolean}
 */
const acquireFileLock = () => {
  if (fs.existsSync(lockFilePath)) {
    // If a lock file exists, another process is writing
    console.log("File is locked; waiting for unlock...");
    return false;
  }

  // Create a lock file to indicate exclusive access
  fs.writeFileSync(lockFilePath, "locked", "utf-8");
  return true;
};

/**
 * used to remove the votes.lock file
 * called after all writes to votes.json have completed in voteController.postVote()
 */
const releaseFileLock = () => {
  fs.unlinkSync(lockFilePath);
};

/**
 * Used to append new votes to the votes.json file
 * @param {*} newVotes
 */
const saveVoteToFile = (votes) => {
  try {
    fs.writeFileSync(votesFilePath, JSON.stringify(votes, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing votes to file:", error);
  }
};

/**
 * Used to calculate the votes per optionId
 * @param {Array} votes array of all votes per pollId
 * @returns {int, Object} total number of votes, {"optionId", count}
 */
const calculateVotes = (votes) => {
  const totalVotes = votes.length;

  //Used to go through the votes array and add each optionId as a property and the value as the count of its votes
  const votesPerOption = votes.reduce(
    //callback function:
    (optionCounts, vote) => {
      const optionId = vote.optionId;
      optionCounts[optionId] = (optionCounts[optionId] || 0) + 1; //key=value
      return optionCounts;
    },
    {} //initial value
  );

  return {
    totalVotes,
    votesPerOption,
  };
};

/**
 * Used to calculate the percentage of the total votes for each optionId
 * @param {int} totalVotes Count of all votes per pollId
 * @param {Object} votesPerOption {"optionId": count}
 * @returns
 */
const calculatePercentages = (totalVotes, votesPerOption) => {
  const percentageVotesPerOption = Object.entries(votesPerOption).reduce(
    //callback function:
    (percentageCounts, [optionId, count]) => {
      const percentage = (count / totalVotes) * 100;
      percentageCounts[optionId] = percentage; //key=value
      return percentageCounts;
    },
    {} //initial value
  );

  return percentageVotesPerOption;
};

// Controller object
const voteController = {};

/**
 * Used to get the Total ammount of votes per pollId and percentage of total votes for each option
 * res.json = {"totalVotes": int,{["optionId", int]}}
 * @param {*} req
 * @param {*} res
 */
voteController.getOptionVotePercentByPollId = (req, res) => {
  const pollId = parseInt(req.params.pollId);
  const votes = getVotesFromFile().filter((vote) => vote.pollId === pollId);

  const { totalVotes, votesPerOption } = calculateVotes(votes);
  const percentageVotesPerOption = calculatePercentages(
    totalVotes,
    votesPerOption
  );

  res.json({
    totalVotes,
    percentageVotesPerOption,
  });
};

/**
 * Used to add new vote to db
 * Uses file lock system to prevent data overwriting and ensures id is unique
 * If file lock check returns false retries up to 5 times
 * @param {*} req
 * @param {*} res
 * @returns
 */
voteController.postVote = (req, res) => {
  const pollId = parseInt(req.params.pollId);
  const optionId = parseInt(req.body.optionId);

  const maxAttempts = 5;
  let attempts = 0;

  while (attempts < maxAttempts) {
    if (acquireFileLock()) {
      try {
        const votesFromFile = getVotesFromFile();

        const newVote = {
          voteId: votesFromFile.length + 1,
          pollId,
          optionId,
        };

        votesFromFile.push(newVote);
        saveVoteToFile(votesFromFile);
        releaseFileLock();

        res.json({ message: "Vote recorded successfully", vote: newVote });
        return;
      } catch (error) {
        console.error("Error processing file operations:", error);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
    } else {
      attempts += 1;
      console.log(
        `Attempt ${attempts}: Unable to acquire file lock; retrying...`
      );
    }
  }

  console.log(
    `File lock not acquired after ${maxAttempts} attempts; try again later`
  );
  res.status(500).json({ error: "Unable to record vote at this time" });
};

module.exports = voteController;