// controllers/technicalFeedbackController.js

const TechnicalSession = require('../models/Answer'); // Session model
const TechnicalQuestion = require('../models/technicalQuestion'); // Question model

const getTechnicalSessionFeedback = async (req, res) => {
  const { userEmail, preparationName } = req.query;

  try {
    const session = await TechnicalSession.findOne({ userEmail, preparationName }).exec();
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const questionsWithSolutions = await Promise.all(
      session.answers.map(async (answer) => {
        const questionData = await TechnicalQuestion.findById(answer.questionId).exec();
        
        if (questionData) {
          return {
            title: questionData.title,
            description: questionData.description,
            correctSolution: questionData.solution,
            userSolution: answer.answer
          };
        } else {
          return {
            title: 'Question not found',
            description: 'This question does not exist in the database.',
            correctSolution: 'N/A',
            userSolution: answer.answer
          };
        }
      })
    );

    res.status(200).json({
      userEmail: session.userEmail,
      preparationName: session.preparationName,
      timeTaken: session.timeTaken,
      questions: questionsWithSolutions
    });
  } catch (error) {
    console.error('Error fetching session feedback:', error);
    res.status(500).json({ message: 'Error fetching session feedback' });
  }
};

module.exports = { getTechnicalSessionFeedback };