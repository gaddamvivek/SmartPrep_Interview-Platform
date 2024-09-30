
const axios = require('axios');
const Question = require('../models/Question');

const getRandomQuestion = async (req, res) => {
  try {
    const { difficulty } = req.query;  // Extract difficulty from query params

    // Check if difficulty level is provided and is valid
    if (!difficulty || !['easy', 'medium', 'hard'].includes(difficulty.toLowerCase())) {
      return res.status(400).json({ message: "Invalid or missing difficulty level. Use 'easy', 'medium', or 'hard'." });
    }

    // Fetch all questions with the specified difficulty (case-insensitive)
    const questions = await Question.find({ difficulty: difficulty.toLowerCase() });

    // Check if any questions are found
    if (questions.length === 0) {
      return res.status(404).json({ message: `No questions found for difficulty level: ${difficulty}.` });
    }

    // Select a random question from the fetched questions
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];

    // Log the random question for debugging (optional)
    console.log("Selected Question:", randomQuestion);

    // Return the random question to the frontend
    return res.status(200).json(randomQuestion);
    
  } catch (error) {
    // Log error to the console for debugging
    console.error("Error fetching random question:", error);

    // Send error message back to the client
    return res.status(500).json({ message: "An error occurred while fetching the random question." });
  }
};


// Function to check User Submitted Code
const submitCode = async (req, res) => {
  const { sourceCode, questionId } = req.body;

  try {
    const question = await Question.findById(questionId);
    const testCases = question.testCases;

    // Prepare input string by joining all test case inputs, separating them by newline
    const inputString = testCases.map(tc => tc.input).join('\n');

    // Submit user's source code to Judge0 API for evaluation (Python Language only)
    const response = await axios.post('https://judge0.p.rapidapi.com/submissions', {
      source_code: sourceCode,
      language_id: 71,
      stdin: inputString,
    }, {
      headers: {
        'x-rapidapi-key': process.env.JUDGE0_API_KEY,
        'x-rapidapi-host': 'judge0.p.rapidapi.com',
      }
    });

    const submissionId = response.data.token;

    let resultResponse;
    do {
      resultResponse = await axios.get(`https://judge0.p.rapidapi.com/submissions/${submissionId}`, {
        headers: {
          'x-rapidapi-key': process.env.JUDGE0_API_KEY,
          'x-rapidapi-host': 'judge0.p.rapidapi.com',
        }
      });
    } while (resultResponse.data.status.id === 1);

    const output = Buffer.from(resultResponse.data.stdout, 'base64').toString('utf-8');
    const errors = Buffer.from(resultResponse.data.stderr, 'base64').toString('utf-8');

    const outputs = output.split('\n').filter(line => line !== '');

    const passedTestCases = testCases.reduce((count, testCase, index) => {
      return outputs[index] === testCase.output ? count + 1 : count;
    }, 0);

    res.json({
      outputs,
      passedTestCases,
      totalTestCases: testCases.length,
      errors,
      status: resultResponse.data.status.description,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = { getRandomQuestion, submitCode };
