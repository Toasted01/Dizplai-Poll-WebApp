const fs = require('fs');
const path = require('path');

/**
 * finds the json file
 * starts at current directory: __dirname
 * then goes up the directory and to data/votes.json
 */
const votesFilePath = path.join(__dirname, '../data/votes.json');
const lockFilePath = path.join(__dirname, '../data/votes.lock');//only exists if a user is writing to votes.json

let cachedVotes = null; // Initialize a variable to cache votes data
let lastModifiedTimestamp = null; // Initialize a variable to track the last modification timestamp

/**
 * todo: check whether the timestamp and caching is necessary in this situation
 * @returns Object
 */
const getVotesFromFile = () => {
  try {
    // Get the current file modification timestamp
    const currentTimestamp = fs.statSync(votesFilePath).mtimeMs;

    // Check if votes data is already cached and if the file has been modified since the last cache update
    if (cachedVotes !== null && currentTimestamp === lastModifiedTimestamp) {
      return cachedVotes;
    }

    // Read votes data from the file
    const votesData = fs.readFileSync(votesFilePath, 'utf-8');

    // Parse the data and update the cache and lastModifiedTimestamp
    cachedVotes = JSON.parse(votesData);
    lastModifiedTimestamp = currentTimestamp;

    return cachedVotes;
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
 * @returns boolean
 */
const acquireFileLock = () => {
  if (fs.existsSync(lockFilePath)) {
    // If a lock file exists, another process is writing; wait or handle accordingly
    console.log('File is locked; waiting for unlock...');
    return false;
  }

  // Create a lock file to indicate exclusive access
  fs.writeFileSync(lockFilePath, 'locked', 'utf-8');
  return true;
};

/**
 * used to remove the votes.lock file
 * called after all writes to votes.json have completed in voteController.postVote()
 */
const releaseFileLock = () => {
  
  fs.unlinkSync(lockFilePath);// Remove the lock file to release exclusive access
};

/**
 * Used to append new votes to the votes.json file
 * uses file locking system to stop overwrites
 * @param {*} newVotes 
 */
const appendVotesToFile = (newVotes) => {
  //checks if file is locked, if not then creates lock file and returns true
  if (acquireFileLock()) {
    try {
      const newVotesJson = JSON.stringify(newVotes, null, 2);// Convert new votes to JSON string
      
      fs.appendFileSync(votesFilePath, `${newVotesJson}\n`, 'utf-8');// Append the new votes to the end of the file
    } catch (error) {
      console.error('Error appending votes to file:', error);
    } finally {
      releaseFileLock();// Release the file lock after writing
    }
  } else {
    console.log('Unable to acquire file lock; try again later');// Handles the case where the file is currently locked by another process
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
  const pollId = parseInt(req.params.pollId);// parses the pollId param into an int
  const votes = getVotesFromFile().filter((vote) => vote.pollId === pollId);// checks each object from getVotesFromFile and filters out all objects that dont contain the pollId supplied
  res.json(votes);// response with the json object of the filtered votes
};

/**
 * 
 * Used to add new vote to db
 * @param {*} req 
 * @param {*} res 
 */
voteController.postVote = (req, res) => {
  const pollId = parseInt(req.params.pollId);
  const optionId = parseInt(req.body.optionId);

  //new vote object to be passed into the json file
  const newVote = {
    voteId: getVotesFromFile().length + 1, // Generate a unique voteId 
    pollId,
    optionId,
  };

  appendVotesToFile(votes);

  res.json({ message: 'Vote recorded successfully', vote: newVote });
};

// Export the controller object
module.exports = voteController;
