const fs = require("fs");
const path = require("path");
const cron = require('node-cron');

const pollsFilePath = path.join(__dirname, "../data/polls.json");

let cachedPolls = null;

// Function to read data from the file
const readDataFromFile = () => {
  try {
    const pollsData = fs.readFileSync(pollsFilePath, 'utf-8');
    return JSON.parse(pollsData);
  } catch (error) {
    console.error('Error reading file:', error);
    return null;
  }
};

// Function to refresh cached polls data
const refreshCachedPolls = () => {
  console.log('Refreshing cached polls data...');
  cachedPolls = readDataFromFile();
};

// Schedule periodic refresh every hour
cron.schedule('0 * * * *', refreshCachedPolls);

/**
 * function to get all the data on the polls
 * checks to see if cachedPolls is empty, then if true retrieves the data from the json file
 * cachedPolls used so that the server doesn't have to make the json retrieval on every run
 * @returns {Object}
 */
const getPollsFromFile = () => {
  if (!cachedPolls) {
    cachedPolls=readDataFromFile();
  }
  return cachedPolls;
};

// Controller object
const pollController = {};

/**
 * Controller function to add a new poll to polls.json
 * Used in Backend/scripts/addPoll.js
 * @param {Object} newPoll 
 */
pollController.addNewPoll = (newPoll) => {
  // Read the existing JSON file
  fs.readFile(pollsFilePath, 'utf8', (err, data) => {
      if (err) {
          console.error('Error reading file:', err);
          return;
      }

      // Parse JSON data
      let polls = JSON.parse(data);

      // Generate a new pollId by incrementing the last pollId
      const newPollId = polls.length > 0 ? polls[polls.length - 1].pollId + 1 : 1;

      // Assign the new pollId to the new poll object
      newPoll.pollId = newPollId;

      // Add the new poll to the existing array of polls
      polls.push(newPoll);

      // Write the updated JSON back to the file
      fs.writeFile(pollsFilePath, JSON.stringify(polls, null, 2), (err) => {
          if (err) {
              console.error('Error writing file:', err);
              return;
          }
          console.log('New poll added successfully.');
          cachedPolls=polls;
          console.log(cachedPolls);
      });
  });
}

/**
 * Controller function to get a poll in polls.json by it's pollId.
 * Used in front end to provide poll details to display
 * @param {*} req
 * @param {*} res
 */
pollController.getPollById = (req, res) => {
  const polls = getPollsFromFile();
  const pollId = req.params.pollId;
  const poll = polls.find((p) => p.pollId == pollId);

  if (!poll) {
    res.status(404).json({ message: "pollid->"+pollId+", poll->"+poll });
  } else {
    res.json(poll);
  }
};

module.exports = pollController;