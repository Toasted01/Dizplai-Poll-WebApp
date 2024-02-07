const fs = require("fs");
const path = require("path");

const pollsFilePath = path.join(__dirname, "../data/polls.json");

let cachedPolls = null;

/**
 * function to get all the data on the polls
 * checks to see if cachedPolls is empty, then if true retrieves the data from the json file
 * cachedPolls used so that the server doesn't have to make the json retrieval on every run
 * @returns {Object}
 */
const getPollsFromFile = () => {
  if (!cachedPolls) {
    const pollsData = fs.readFileSync(pollsFilePath, "utf-8");
    cachedPolls = JSON.parse(pollsData);
  }
  return cachedPolls;
};

// Controller object
const pollController = {};

/**
 * Controller function to get a poll in polls.json by it's pollId.
 * Used in front end to provide poll details to display
 * @param {*} req
 * @param {*} res
 */
pollController.getPollById = (req, res) => {
  const polls = getPollsFromFile(); // Get the array of polls from the JSON file or cache
  const pollId = parseInt(req.params.pollId); // Extract the poll ID from the request parameters and convert it to an integer
  const poll = polls.find((p) => p.pollId === pollId); // Find the poll with the specified ID in the polls array where 'p' is the current poll object in the find loop

  // Check if the poll with the specified ID was not found
  if (!poll) {
    res.status(404).json({ message: "Poll not found" }); // Respond with a 404 status and a JSON message indicating that the poll was not found
  } else {
    res.json(poll); // Respond with a JSON object representing the found poll
  }
};

module.exports = pollController;