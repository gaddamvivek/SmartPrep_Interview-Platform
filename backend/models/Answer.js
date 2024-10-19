const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  intervieweeId: {
    type: String,
    required: true,
  },
  answers: {
    type: [String], // Array of strings (answers)
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

const Answer = mongoose.model('Answer', AnswerSchema);

module.exports = Answer;
