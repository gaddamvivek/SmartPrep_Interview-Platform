const express = require('express');
const router = express.Router();
const { getRandomTechnicalQuestions, saveAnswer, saveCapturedImage } = require('../controllers/technicalQuestionController'); // Make sure this is correct

router.get('/getRandomTechnicalQuestions', getRandomTechnicalQuestions);
router.post('/getRecordAnswer', saveAnswer);
router.post('/capture', saveCapturedImage);

module.exports = router;
