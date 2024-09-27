const express = require('express');
const cors = require('cors');
const authenticationRoutes = require('./routes/auth');
const mongoose = require('mongoose');
const QuestionRoutes = require('./routes/questions');
const axios = require('axios'); // Import axios for API calls
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('-- Connection to MongoDB Successful --'))
  .catch(err => console.log(err));

// Judge0 API details
const JUDGE0_API_URL = 'https://judge0-ce.p.rapidapi.com';
const RAPID_API_KEY = process.env.JUDGE0_API_KEY; // Your RapidAPI key here

// API Routes
app.use('/api/Questions', QuestionRoutes);
app.use('/auth', authenticationRoutes);

// Code submission endpoint
app.post('/api/submit', async (req, res) => {
  const { code, testCases } = req.body;

  // Prepare input for Judge0
  const inputString = testCases.map(tc => tc.input).join('\n');

  try {
    const submissionResponse = await axios.post(
      `${JUDGE0_API_URL}/submissions`,
      {
        source_code: code,
        language_id: 71, // Python
        stdin: inputString,
      },
      {
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': RAPID_API_KEY,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        },
      }
    );

    const token = submissionResponse.data.token;

    // Wait for result
    setTimeout(async () => {
      try {
        const resultResponse = await axios.get(
          `${JUDGE0_API_URL}/submissions/${token}`,
          {
            headers: {
              'X-RapidAPI-Key': RAPID_API_KEY,
              'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
            },
          }
        );

        res.json(resultResponse.data);
      } catch (error) {
        console.error('Error fetching result:', error);
        res.status(500).json({ error: 'Error fetching result' });
      }
    }, 2000);
  } catch (error) {
    console.error('Error during submission:', error);
    res.status(500).json({ error: 'Error submitting code' });
  }
});

// New endpoint for dynamic question generation
app.post('/api/generateQuestion', async (req, res) => {
  const { difficulty } = req.body; // Get difficulty from request body ('easy', 'medium', 'hard')

  try {
    const prompt = `
      Generate a Python coding question based on difficulty "${difficulty}". Provide the following:
      1. A title for the problem.
      2. A description of the problem.
      3. Two test cases with inputs and expected outputs.
      4. A Python function that solves the problem.
    `;

    // Call OpenAI API to generate coding question
    const response = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        model: 'text-davinci-003',  // Use a suitable model
        prompt: prompt,
        max_tokens: 300,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${GEMINI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const generatedText = response.data.choices[0].text;

    // Parse the generated text into question fields
    const [title, description, testCase1, testCase2, solution] = generatedText.split('\n').filter(line => line.trim() !== '');

    const question = {
      title: title.trim(),
      description: description.trim(),
      testCases: [
        { input: testCase1.split('Input: ')[1], output: testCase1.split('Output: ')[1] },
        { input: testCase2.split('Input: ')[1], output: testCase2.split('Output: ')[1] }
      ],
      solution: solution.trim()
    };

    // Return the newly generated question
    res.json(question);

  } catch (error) {
    console.error('Error generating question:', error);
    res.status(500).json({ error: 'Error generating question' });
  }
});

// use PORT = 5001 set in .env file
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`-- Server running on port ${PORT}. --`);
});
