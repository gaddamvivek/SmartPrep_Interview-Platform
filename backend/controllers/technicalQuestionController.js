const TechnicalQuestion = require('../models/technicalQuestion');
const getAIFeedbackHelper = require('../helper/getTechAIFeedback');

// Function to fetch random technical questions by difficulty
const getAnswers = async (req, res) => {
  try {
    const { questionId } = req.query;

    let questionsWithAnswers;

    if (questionId) {
      // Fetch the specific question with its answers
      questionsWithAnswers = await TechnicalQuestion.findById(questionId, 'title answers').exec();
      
      if (!questionsWithAnswers) {
        return res.status(404).json({ message: 'Answer not found' });
      }
    } else {
      // Fetch all questions with their answers
      questionsWithAnswers = await TechnicalQuestion.find({}, 'title answers').exec();
    }

    return res.status(200).json(questionsWithAnswers);
  } catch (error) {
    console.error('Error retrieving answers:', error);
    return res.status(500).json({ message: 'Error retrieving answers.', error });
  }
};

const getRandomTechnicalQuestions = async (req, res) => {
  try {
    const { difficulty, position, company } = req.query;
    let questions;

    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
      return res.status(400).json({ message: 'Invalid difficulty level. Choose easy, medium, or hard.' });
    }
    // Fetch questions from the database filtered by difficulty
    console.log(company);
    console.log(position);
    console.log(difficulty);
    if(position != 'All' && company != 'null'){
        console.log('Hello if')
        questions = await TechnicalQuestion.find({ difficulty, position, company }).exec();
    }
    else{
      console.log('Bye Else');
      questions = await TechnicalQuestion.find({ difficulty }).exec();
    }

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
// New function to provide AI feedback using Google Generative AI
const getAIFeedback = async (req, res) => {
  const { answer, questionId } = req.body;

  try {
    // Retrieve the question description from the database
    const question = await TechnicalQuestion.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found.' });
    }
    
    const questionDescription = question.description;
    console.log(questionDescription);

    // Call the AI feedback helper function with the question description and user code
    const feedback = await getAIFeedbackHelper(questionDescription, answer);

    res.json({ feedback });
  } catch (error) {
    console.error('Error getting AI feedback:', error);
    res.status(500).json({ message: 'Failed to get AI feedback' });
  }
};


module.exports = {
  getRandomTechnicalQuestions,
  saveAnswer,
  getAnswers,
  saveCapturedImage,
  getAIFeedback,
};
