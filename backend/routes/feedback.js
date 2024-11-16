const express = require('express');
const router = express.Router();
const { getSessionDetailsWithQuestionInfo } = require('../controllers/feedbackController');
router.get('/sessions/details/:userId/:prName', getSessionDetailsWithQuestionInfo);
const { submitFeedback } = require('../controllers/feedbackController');
router.post('/submit', submitFeedback);
module.exports = router;
