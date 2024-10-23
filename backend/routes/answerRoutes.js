/*const express = require('express');
const Answer = require('../models/Answer');

const router = express.Router();

// Save answers
router.post('/save', async (req, res) => {
  const { userEmail, timeTaken, intervieweeId, answers } = req.body;

  if (!intervieweeId || !answers || !Array.isArray(answers)) {
    return res.status(400).json({ message: 'Invalid data. Interviewee ID and answers are required.' });
  }

  try {
    const newAnswer = new Answer({
      userEmail,
      timeTaken,
      intervieweeId,
      answers,
    });

    await newAnswer.save();
    res.status(201).json({ message: 'Answers saved successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving answers', error });
  }
});

// Get all answers (optional, for testing)
router.get('/', async (req, res) => {
  try {
    const allAnswers = await Answer.find();
    res.status(200).json(allAnswers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching answers', error });
  }
});

module.exports = router;*/
