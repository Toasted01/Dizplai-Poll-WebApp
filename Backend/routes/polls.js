const express = require('express');
const router = express.Router();
const pollController = require('../controllers/pollController');

// Get the count of all polls
router.get('/count', pollController.getCountOfPolls);

//Get a poll by its id
router.get('/:pollId', pollController.getPollById);

module.exports = router;