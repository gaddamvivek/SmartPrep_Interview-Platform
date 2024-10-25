const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  questionId: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  }
});

const InterviewResponseSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  timeTaken: { type: String, required: true },
  answers: {
    type: [AnswerSchema], // Array of AnswerSchema objects
    required: true,
  },
});

const InterviewResponse = mongoose.model('InterviewResponse', InterviewResponseSchema);

module.exports = InterviewResponse;
