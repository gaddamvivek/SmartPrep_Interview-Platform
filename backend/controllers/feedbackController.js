// backend/controllers/feedbackController.js
const Feedback = require('../models/Feedback.js');

// Controller to handle feedback submission
const submitFeedback = async (req, res) => {
  const { passedTestCases, totalTestCases, review, feedback, userId } = req.body;

  try {
    const newFeedback = new Feedback({
      passedTestCases,
      totalTestCases,
      review,
      feedback,
      userId,
    });

    await newFeedback.save();
    res.status(201).json({ message: 'Feedback saved successfully' });
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).json({ message: 'Error saving feedback', error: error.message });
  }
};

// Export the function properly
module.exports = { submitFeedback };