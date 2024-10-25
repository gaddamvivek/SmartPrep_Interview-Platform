import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import TechAnswerInputs from './TechAnswerInputs';
import './TechnicalInterview.css';

const TechnicalInterview = ({ permissions }) => {
  const [questions, setQuestions] = useState([]);
  const [difficulty, setDifficulty] = useState('easy');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    fetchQuestions(difficulty); // Fetch questions when the component mounts or difficulty changes
  }, [difficulty]);

  const fetchQuestions = async (difficulty) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/tech/getRandomTechnicalQuestions?difficulty=${difficulty}`);
      setQuestions(response.data.slice(0, 3)); // Assuming you only want 3 questions at a time
      setCurrentQuestionIndex(0); // Reset to the first question when questions are fetched
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };
  const handleSpeech = () => {
    const syn = window.speechSynthesis;
    const currentQuestion = questions[currentQuestionIndex].title;
    console.log(currentQuestion)
    const utterance = new SpeechSynthesisUtterance(currentQuestion);
    syn.speak(utterance)
  }

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
              <button onClick = {handleSpeech}>speech</button>
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
  );
};

// Add prop types validation
TechnicalInterview.propTypes = {
  permissions: PropTypes.object.isRequired, // Assuming permissions is an object, adjust the type accordingly
};

export default TechnicalInterview;


