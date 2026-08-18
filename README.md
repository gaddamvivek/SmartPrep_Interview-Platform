# SmartPrep Interview Platform

Live app: https://smart-prep-vivek.vercel.app/

SmartPrep is a mock interview platform that lets candidates practice both technical and behavioral interviews and get AI generated feedback on their performance. It runs full interview sessions end to end: pick a role and difficulty, answer questions on camera or in a code editor, submit, and get scored feedback right after.

## What it does

Candidates sign in, choose a company or role and a difficulty level, and start a session. There are two interview modes.

Technical interviews use a built in code editor. Candidates write a solution, submit it, and the code actually runs against real test cases through a code execution service, not just a simulated pass or fail. After that, the candidate can request AI feedback, which scores the code on readability, correctness, and efficiency and explains what to improve, without giving away the actual solution.

Behavioral interviews turn on the candidate's webcam and microphone. Their spoken answer is transcribed live with speech recognition, and the webcam feed is recorded locally so they can review themselves later. Submitted answers can also get AI feedback, scored on conceptual accuracy, clarity of communication, and depth of insight.

After each session, results and feedback are saved, and the dashboard shows session history, stats, and a practice streak so candidates can track progress over time.

## Features

- Email and password login, plus Google sign in through Firebase
- Technical interview mode with a Monaco based code editor
- Real code execution against test cases, not just pattern matching
- Behavioral interview mode with webcam recording and live speech to text
- AI generated feedback for both code and spoken answers, with numeric scoring
- Session history, past feedback, and progress stats on a personal dashboard
- Practice streak tracking

## Tech stack

Frontend
- React with React Router
- Tailwind CSS
- Monaco Editor for the code editor
- react-webcam and the browser MediaRecorder API for video capture
- react-speech-recognition for live transcription
- Firebase Authentication (client side)

Backend
- Node.js and Express
- MongoDB with Mongoose
- Firebase Admin SDK for verifying Google sign in server side
- JWT and bcrypt for session and password handling
- Judge0 for sandboxed code execution
- Google Generative AI (Gemini) for scoring and feedback generation

Deployment
- Frontend deployed on Vercel

## Running it locally

Clone the repository.

```
git clone https://github.com/gaddamvivek/SmartPrep_Interview-Platform.git
cd SmartPrep_Interview-Platform
```

Start the backend.

```
cd backend
npm install
node server.js
```

The backend needs a `.env` file with values for `MONGO_URI`, `TOKEN_SECRET_KEY`, `GEMINI_API_KEY`, `JUDGE0_API_KEY`, and either a `firebase-adminsdk-key.json` file or a `FIREBASE_SERVICE_ACCOUNT` environment variable for the Firebase Admin SDK.

In a new terminal, start the frontend.

```
cd frontend
npm install
npm start
```

The frontend needs a `.env` file with `REACT_APP_BACKEND_URL` pointing at the backend.

## Project structure

```
backend/
  controllers/   request handlers for auth, questions, feedback, sessions
  models/        Mongoose schemas
  routes/        Express route definitions
  helper/        AI feedback generation logic
  server.js      app entry point and code execution endpoint

frontend/
  src/components/  interview flow, editor, dashboard, and auth UI
  src/firebase.js  Firebase client setup
```
