const fs = require("fs");
const path = require("path");

/**
 * finds the json file
 * starts at current directory: __dirname
 * then goes up the directory and to data/votes.json
 */
const votesFilePath = path.join(__dirname, "../data/votes.json");
const lockFilePath = path.join(__dirname, "../data/votes.lock"); //only exists if a user is writing to votes.json


/**
 * Reads votes data from the file and returns it.
 * @returns {Array|Object} - Array of votes
 */
const getVotesFromFile = () => {
  try {
    const votesData = fs.readFileSync(votesFilePath, 'utf8');
    return JSON.parse(votesData);
  } catch (error) {
    console.error('Error reading votes file:', error);
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
  fs.unlinkSync(lockFilePath); // Remove the lock file to release exclusive access
};

/**
 * Used to append new votes to the votes.json file
 * @param {*} newVotes
 */
const saveVotesToFile = (votes) => {
  try {
    fs.writeFileSync(votesFilePath, JSON.stringify(votes, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing votes to file:", error);
  }
};

// Controller object
const voteController = {};

/**
 * Used to get all the votes relating to the pollId passed in req
 * Used to show percentage overlay
 * @param {*} req
 * @param {*} res
 */
voteController.getVotesByPollId = (req, res) => {
  const pollId = parseInt(req.params.pollId); // parses the pollId param into an int
  const votes = getVotesFromFile().filter((vote) => vote.pollId === pollId); // checks each object from getVotesFromFile and filters out all objects that dont contain the pollId supplied
  res.json(votes); // response with the json object of the filtered votes
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

        // Append the new vote to the array
        votesFromFile.push(newVote);

        // Save only the new vote to the file
        saveVotesToFile(votesFromFile);

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

// Export the controller object
module.exports = voteController;
