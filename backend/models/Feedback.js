const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  passedTestCases: { type: Number, required: true },
  totalTestCases: { type: Number, required: true },
  review: { type: Number, required: true },  // Rating out of 5
  feedback: { type: String, required: true },  // User's feedback
  date: { type: Date, default: Date.now },  // Timestamp
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Reference to user (optional)
});

module.exports = mongoose.model('Feedback', feedbackSchema);