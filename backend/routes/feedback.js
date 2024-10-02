const express = require('express');
const { submitFeedback } = require('../controllers/feedbackController');  // Ensure correct import
const router = express.Router();

router.post('/submit', submitFeedback);  // Define the POST route for feedback

module.exports = router;