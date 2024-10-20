const TechnicalQuestion = require('../models/technicalQuestion');

// Function to fetch random technical questions by difficulty
const getRandomTechnicalQuestions = async (req, res) => {
  try {
    const { difficulty } = req.query;

    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
      return res.status(400).json({ message: 'Invalid difficulty level. Choose easy, medium, or hard.' });
    }

    // Fetch questions from the database filtered by difficulty
    const questions = await TechnicalQuestion.find({ difficulty }).exec();

    if (questions.length === 0) {
      return res.status(404).json({ message: 'No questions found for this difficulty.' });
    }

    return res.status(200).json(questions);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching technical questions.', error });
  }
};

// Function to save recorded answers
const saveAnswer = async (req, res) => {
  try {
    const { questionId, transcript } = req.body;

    if (!questionId || !transcript) {
      return res.status(400).json({ message: 'Missing question ID or transcript.' });
    }

    // Save the answer to the database (or store in an object linked to the user)
    await TechnicalQuestion.findByIdAndUpdate(
      questionId,
      { $push: { answers: { transcript } } }, // Assumes an "answers" field in your schema
      { new: true, useFindAndModify: false }
    );

    return res.status(200).json({ message: 'Answer saved successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error saving answer.', error });
  }
};

// Function to capture and save image (if storing images)
const saveCapturedImage = async (req, res) => {
  try {
    const { imageSrc } = req.body;

    if (!imageSrc) {
      return res.status(400).json({ message: 'No image captured.' });
    }

    // You can handle saving the image here - for example, uploading it to cloud storage
    // or saving the base64 data in the database. This is just an example return.
    return res.status(200).json({ message: 'Image captured successfully.', imageSrc });
  } catch (error) {
    return res.status(500).json({ message: 'Error capturing image.', error });
  }
};

module.exports = {
  getRandomTechnicalQuestions,
  saveAnswer,
  saveCapturedImage,
};
