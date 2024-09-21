const mongoose = require('mongoose');

// Schema for MongoDB Coding Questions
const questionSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Coding Question Title
  description: { type: String, required: true }, // Description
  testCases: [{ input: String, output: String }], // has input and output test cases
  solution: { type: String, required: true }, // Python Solution
  // Difficulty of the coding question must be handled.
});

module.exports = mongoose.model('Question', questionSchema);
