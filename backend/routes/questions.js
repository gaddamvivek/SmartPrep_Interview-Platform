const express = require('express');
const router = express.Router();
const { getRandomQuestion, submitCode } = require('../controllers/QuestionController');

// API calls to QuestionController.js
router.get('/Random', getRandomQuestion);
router.post('/submit', submitCode);

module.exports = router;
