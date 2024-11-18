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
  preparationName:{type :String, required: true},
  positionName: { type: String, required: true },
  prepDiff: { type: String, required: true },
  sessionStartDate:{ type: String, required: true },
  sessionEndDate:{ type: String, required: true },
  sessionStartTime:{ type: String, required: true },
  sessionEndTime:{ type: String, required: true },
  timeTaken: { type: String, required: true },
  answers: {
    type: [AnswerSchema], // Array of AnswerSchema objects
    required: true,
  },
});

module.exports = mongoose.model("TechnicalSession", InterviewResponseSchema);
