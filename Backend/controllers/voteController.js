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
    // Read votes data from the file
    const votesData = fs.readFileSync(votesFilePath, "utf-8");

    // Parse the data and return it
    return JSON.parse(votesData);
  } catch (error) {
    // If the file doesn't exist or is empty, return an empty array
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
    // If a lock file exists, another process is writing; wait or handle accordingly
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
const appendVotesToFile = (newVotes) => {
  try {
    const newVotesJson = JSON.stringify(newVotes, null, 2); // Convert new votes to JSON string
    fs.appendFileSync(votesFilePath, `${newVotesJson}\n`, "utf-8"); // Append the new votes to the end of the file
  } catch (error) {
    console.error("Error appending votes to file:", error);
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
  const pollId = parseInt(req.params.pollId);// Poll chosen
  const optionId = parseInt(req.body.optionId);// Option chosen

  const maxAttempts = 5; // Set a maximum number of attempts if needed
  let attempts = 0;

  while (attempts < maxAttempts) {
    if (acquireFileLock()) {
      const newVote = {
        voteId: getVotesFromFile().length + 1, // Generate a unique voteId
        pollId,
        optionId,
      };

      appendVotesToFile(newVote);
      releaseFileLock();
      res.json({ message: "Vote recorded successfully", vote: newVote });
      return; // Exit the function if vote is recorded successfully
    } else {
      attempts += 1;
      console.log(`Attempt ${attempts}: Unable to acquire file lock; retrying...`);
    }
  }

  console.log(`File lock not acquired after ${maxAttempts} attempts; try again later`);
  res.status(500).json({ error: "Unable to record vote at this time" });
};

// Export the controller object
module.exports = voteController;
