import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios';
import TechAnswerInputs from './TechAnswerInputs';
import './TechnicalInterview.css';

const TechnicalInterview = ({ permissions }) => {
  const [questions, setQuestions] = useState([{ _id: 1, title: 'What is React?', description: 'Explain the basic concepts of React.' },
    { _id: 2, title: 'What is Node.js?', description: 'Describe the main features of Node.js.' },
    { _id: 3, title: 'What is MongoDB?', description: 'What are the advantages of using MongoDB?' }]);
  const [difficulty, setDifficulty] = useState('easy');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});


  useEffect(() => {
    fetchQuestions();
  }, [difficulty]);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`api/tech/getRandomTechnicalQuestions?difficulty=medium`);
      alert(response.data)
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
      {/* Header Section */}
      <div className="header">
        <span>PrepSmart</span>
      </div>
  
      {/* Main Container */}
      <div className="technical-interview-container">
        
        {/* Left Section: Questions */}
        <div className="question-section">
        <h2>Technical Interview</h2>
          <div className="difficulty-selection">
            <label>Change Difficulty Level: </label>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
  
          {/* Navigation Buttons */}
          <div className="question-navigation">
            <button onClick={previousQuestion} disabled={currentQuestionIndex === 0}>Previous</button>
            <button onClick={nextQuestion} disabled={currentQuestionIndex === questions.length - 1}>Next</button>
          </div>
  
          {/* Display the current question */}
          {questions.length > 0 && (
            <div>
              <h3>Question: {questions[currentQuestionIndex].title}</h3>
              <p>{questions[currentQuestionIndex].description}</p>
            </div>
          )}
        </div>
  
        {/* Right Section: Answer Input */}
        <div className="answer-section">
          <TechAnswerInputs 
            permissions={permissions}
            saveAnswer={saveAnswer}
            currentAnswer={answers[questions[currentQuestionIndex]?._id] || ''} 
            onSubmitAnswers={submitAnswers}
          />
        </div>
      </div>
    </div>
  )};
  

export default TechnicalInterview;
