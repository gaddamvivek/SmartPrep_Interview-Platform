const express = require('express');
const router = express.Router();
const { getRandomQuestion, submitCode, RunCode } = require('../controllers/questionController');

// API calls to QuestionController.js
router.get('/Random', getRandomQuestion);
router.post('/submit', submitCode);
router.post('/runs', RunCode);

module.exports = router;