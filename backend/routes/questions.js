const express = require('express');
const router = express.Router();
const { getRandomQuestion, submitCode, RunCode,getAIFeedback } = require('../controllers/questionController');
router.get('/Random', getRandomQuestion);
router.post('/submit', submitCode);
router.post('/runs', RunCode);
router.post('/feedback', getAIFeedback);

module.exports = router;