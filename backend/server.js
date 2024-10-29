const express = require('express');
const cors = require('cors');
const authenticationRoutes = require('./routes/auth')
const userRoutes = require('./routes/user.js')
const mongoose = require('mongoose');
const QuestionRoutes = require('./routes/questions');
const axios = require('axios');
const path = require('path');
const admin = require('firebase-admin'); // Firebase Admin SDK for Google Auth
const feedbackRoutes = require('./routes/feedback'); //feedback route
const techQnRoutes = require('./routes/techQn'); // technical questions route
const answerRoutes = require('./routes/answerRoutes');
const technicalSessionRoutes = require('./routes/technicalSessionRoutes');

require('dotenv').config();
const User = require('./models/user'); // Import the User model
//const Answer = require('./models/Answer');

// Initialize Firebase Admin SDK
const serviceAccount = require(path.join(__dirname, 'firebase-adminsdk-key.json')); 

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/feedback', feedbackRoutes); // feedback
app.use('/api/technicalSession', technicalSessionRoutes);
app.use('/api/answer', answerRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('-- Connection to MongoDB Successful --'))
  .catch(err => console.log(err));

// Judge0 API details
const JUDGE0_API_URL = 'https://judge0-ce.p.rapidapi.com';
const RAPID_API_KEY = process.env.JUDGE0_API_KEY;

app.use('/api/Questions', QuestionRoutes);
app.use('/auth', authenticationRoutes);
app.use('/api/tech', techQnRoutes); // Technical questions routes
// Google Sign-In Route
app.post('/auth/google', async (req, res) => {
  const { token } = req.body;

  try {
    // Verify the token using Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { email, name, uid } = decodedToken;

    // Check if the user already exists in MongoDB
    let user = await User.findOne({ googleId: uid });

    if (!user) {
      // Create a new user if not found
      user = new User({
        googleId: uid,
        email,
        name,
        provider: 'google',
      });
      await user.save();
    }

    // Send response with user data
    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Error during Google authentication:', error);
    res.status(500).json({ error: 'Google authentication failed' });
  }
});
// const RAPID_API_KEY = process.env.JUDGE0_API_KEY; // Your RapidAPI key here

// API Routes
app.use('/api/Questions', QuestionRoutes);
app.use('/auth', authenticationRoutes);

app.use('/api/answers', answerRoutes);
app.use('/api/user', userRoutes);

//app.use('/api/answers', answerRoutes);


// API route to submit answers for technical interview
/*app.post('/api/submit-answers', async (req, res) => {
  const { intervieweeId, answers } = req.body;

  try {
    // Create a new Answer document in MongoDB
    const newAnswer = new Answer({
      intervieweeId,
      answers
    });

    await newAnswer.save();  // Save the document to MongoDB
    res.status(200).json({ message: 'Answers submitted successfully' });
  } catch (error) {
    console.log(intervieweeId,answers);
    console.log(error);
    res.status(500).json({ message: 'Error saving answers', error });
  }
});*/


// Code submission endpoint
app.post('/api/submit', async (req, res) => {
  const { code, testCases } = req.body;
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

// Use PORT = 5001 set in .env file
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`-- Server running on port ${PORT}. --`);
});
