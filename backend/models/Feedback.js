const mongoose = require('mongoose');
const feedbackSchema = new mongoose.Schema({
  passedTestCases: { type: Number, default: null },
  totalTestCases: { type: Number, default: null },
  review: { type: Number, required: true },  // Rating out of 5
  feedback: { type: String, required: true },
  date: { type: Date, default: Date.now },  // Timestamp
  // userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});
module.exports = mongoose.model('Feedback', feedbackSchema);