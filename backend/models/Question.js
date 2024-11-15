const mongoose = require('mongoose');

// Schema for MongoDB Coding Questions 
const questionSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Coding Question Title
  description: { type: String, required: true }, // Description
  testCases: [{ input: String, output: String }], // Input and output test cases
  solution: { type: String, required: true }, // Python Solution
  difficulty: { type: String, required: true,  enum: ['easy', 'medium', 'hard']},  // Question difficulty level (easy, medium, hard), 
  company : { type: String, required: true,  enum: ['Amazon', 'Google']},
  position : { type: String, required: true,  enum: ['Python Developer I', 'Python Developer II']}
});

module.exports = mongoose.model('Question', questionSchema);
