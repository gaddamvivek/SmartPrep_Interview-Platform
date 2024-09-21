const axios = require('axios');
const Question = require('../models/Question');


/* The below getRandomQuestion Function  - https://chatgpt.com/share/66eea7de-12dc-800b-aa7a-fef39d997b69 */
// Function to display RandomQuestion from MongoDB database to Client
const getRandomQuestion = async (req, res) => {
  try {
    const questions = await Question.find();
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    res.json(randomQuestion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function to check User Submitted Code 
const submitCode = async (req, res) => {
  // Extract sourceCode and questionId from req body
  const { sourceCode, questionId } = req.body;

  try {
    // Find coding question by its ID  along with test cases in Mongo DataBase
    const question = await Question.findById(questionId);
    const testCases = question.testCases; 

    // Prepare input string by joining all test case inputs, separating them by newline
    const inputString = testCases.map(tc => tc.input).join('\n');

    // Submit user's source code to the Judge0 API for evaluation (Python Language only)
    const response = await axios.post('https://judge0.p.rapidapi.com/submissions', {
      source_code: sourceCode,  
      language_id: 71,
      stdin: inputString,      
    }, {
      headers: {
        'x-rapidapi-key': process.env.JUDGE0_API_KEY,  // API key for Judge0
        'x-rapidapi-host': 'judge0.p.rapidapi.com',    // API host
      }
    });

    // Retrieve submission ID from Judge0 response
    const submissionId = response.data.token;

    let resultResponse;
    // Polling Judge0 API until submission status is no longer 'In Progress' (status id 1)
    do {
      resultResponse = await axios.get(`https://judge0.p.rapidapi.com/submissions/${submissionId}`, {
        headers: {
          'x-rapidapi-key': process.env.JUDGE0_API_KEY,  // API key for Judge0
          'x-rapidapi-host': 'judge0.p.rapidapi.com',    // API host
        }
      });
    } while (resultResponse.data.status.id === 1);  //Check until code execution completes

    // Decode the result output and potential errors (base64 encoded)
    const output = Buffer.from(resultResponse.data.stdout, 'base64').toString('utf-8');
    const errors = Buffer.from(resultResponse.data.stderr, 'base64').toString('utf-8');

    // Split output by new lines and filter out empty lines
    const outputs = output.split('\n').filter(line => line !== '');

    // Validate user's output against expected output from test cases
    const passedTestCases = testCases.reduce((count, testCase, index) => {
      return outputs[index] === testCase.output ? count + 1 : count;
    }, 0);

    // Return code submission result including outputs, test case validation, errors, and status
    res.json({
      outputs,                  // Output of user's code
      passedTestCases,           // Number of test cases user's code passed
      totalTestCases: testCases.length,  // Total number of test cases
      errors,                    // Any errors encountered during execution
      status: resultResponse.data.status.description,  // Status of submission (e.g., 'Accepted', 'Compilation Error', etc.)
    });

  } catch (error) {
    //  Send a 500 response with the error message for any errors
    res.status(500).json({ message: error.message });
  }
};


module.exports = { getRandomQuestion, submitCode };
