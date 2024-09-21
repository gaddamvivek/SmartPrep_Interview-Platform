const express = require('express');
const cors = require('cors');
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

// use PORT = 5001 set in .env file
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`-- Server running on port ${PORT}. --`);
});
