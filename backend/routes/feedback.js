// const express = require('express');
// const { submitFeedback } = require('../controllers/feedbackController'); 
// const router = express.Router();
// router.post('/submit', submitFeedback); 
// module.exports = router;

// routes/feedback.js
const express = require('express');
const router = express.Router();
const { getSessionDetailsWithQuestionInfo } = require('../controllers/feedbackController');

// Ensure this route is defined as shown below
router.get('/sessions/details/:userId/:prName', getSessionDetailsWithQuestionInfo);

const { submitFeedback } = require('../controllers/feedbackController'); // Ensure the path is correct

// Define the route
router.post('/submit', submitFeedback);
module.exports = router;
