const express = require('express');
const router = express.Router();
const voteController = require('../controllers/voteController');

// Get all votes for a specific poll
router.get('/:pollId', voteController.getOptionVotePercentByPollId);

// Post a new vote
router.post('/:pollId', voteController.postVote);

// Export the router
module.exports = router;