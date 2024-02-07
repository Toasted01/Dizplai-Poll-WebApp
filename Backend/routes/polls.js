const express = require("express");
const router = express.Router();
const pollController = require("../controllers/pollController");

//Get a poll by its id
router.get("/:pollId", pollController.getPollById);

module.exports = router;