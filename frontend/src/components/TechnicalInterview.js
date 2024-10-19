import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios';
import TechAnswerInputs from './TechAnswerInputs';

const TechnicalInterview = ({ permissions }) => {
  const [questions, setQuestions] = useState([{ _id: 1, title: 'What is React?', description: 'Explain the basic concepts of React.' },
    { _id: 2, title: 'What is Node.js?', description: 'Describe the main features of Node.js.' },
    { _id: 3, title: 'What is MongoDB?', description: 'What are the advantages of using MongoDB?' }]);
  const [difficulty, setDifficulty] = useState('easy');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});


  useEffect(() => {
    //fetchQuestions();
  }, [difficulty]);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`/api/tech/getRandomTechnicalQuestions?difficulty=${difficulty}`);
      console.log(response.data)
      //setQuestions(response.data.slice(0, 3)); // Get only 3 questions
      setCurrentQuestionIndex(0); // Reset to first question when difficulty changes
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const saveAnswer = (answer) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion) {
      setAnswers((prevAnswers) => ({
        ...prevAnswers,
        [currentQuestion._id]: answer, // Save the answer for the current question
      }));
    }
    alert('Answer saved!');
  };

  const submitAnswers = async () => {
    const intervieweeId = '12345'; // Replace with actual interviewee ID
    const formattedAnswers = Object.keys(answers).map((questionId) => ({
      questionId,
      answer: answers[questionId],
    }));

    try {
      await axios.post('http://localhost:5001/api/submit-answers', {
        intervieweeId,
        answers: formattedAnswers,
      });
      alert('Answers submitted successfully');
    } catch (error) {
      console.error('Error submitting answers:', error);
      alert('Error submitting answers');
    }
  };

  return (
    <div>
      <h1>Technical Interview Platform</h1>

      {/* Display current question index out of total */}
      <div>
        <h2>
          Question {currentQuestionIndex + 1} of {questions.length}
        </h2>
      </div>

      {/* Difficulty selection */}
      <div>
        <label>Select Difficulty: </label>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      {/* Display Single Question */}
      <div>
        {questions.length > 0 && (
          <div>
            <h3>Question: {questions[currentQuestionIndex].title}</h3>
            <p>{questions[currentQuestionIndex].description}</p>
          </div>
        )}
      </div>

      {/* Navigation Buttons for Questions */}
      <div>
        <button onClick={previousQuestion} disabled={currentQuestionIndex === 0}>
          Previous Question
        </button>
        <button onClick={nextQuestion} disabled={currentQuestionIndex === questions.length - 1}>
          Next Question
        </button>
      </div>

      {/* Answer Input and Save */}
      <TechAnswerInputs 
        permissions={permissions}
        saveAnswer={saveAnswer}
        currentAnswer={answers[questions[currentQuestionIndex]?._id] || ''} // Pass the saved answer for the current question
        onSubmitAnswers={submitAnswers}
      />
    </div>
  );
};

export default TechnicalInterview;
