import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import './ide.css'; 
import { useNavigate } from 'react-router-dom';

const Question = ({ setQuestionId }) => {
  const [questions, setQuestions] = useState([]);
  const [difficulty, setDifficulty] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const navigate = useNavigate(); 

  const startSession = () => {
  //  localStorage.setItem('codingSessionActive', 'true'); 
    console.log('Session started');
  };

  const endSession = () => {
    localStorage.removeItem('sessionQuestions');
    localStorage.removeItem('sessionDifficulty');
    localStorage.removeItem('codingSessionActive'); 
    navigate('/dashboard'); 
  };

  const fetchQuestions = async (selectedDifficulty) => {
    try {
      const res = await axios.get(`http://localhost:5001/api/questions/Random?difficulty=${selectedDifficulty}`);
      const fetchedQuestions = res.data;
      setQuestions(fetchedQuestions);
      localStorage.setItem('sessionQuestions', JSON.stringify(fetchedQuestions));
      setQuestionId(fetchedQuestions[0]._id);
      setDifficulty(selectedDifficulty); 
      startSession();
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  useEffect(() => {
    const localQuestions = JSON.parse(localStorage.getItem('sessionQuestions'));
    const savedDifficulty = localStorage.getItem('selectedDifficulty');
    // setDifficulty(savedDifficulty);

    if (localQuestions && localQuestions.length > 0) {
      setQuestions(localQuestions);
      setQuestionId(localQuestions[0]._id);
      setDifficulty(savedDifficulty);
    } else if (savedDifficulty) {
      fetchQuestions(savedDifficulty);
      setDifficulty(savedDifficulty);
    }

    const handleBeforeUnload = (event) => {
      if (localStorage.getItem('codingSessionActive')) {
        event.preventDefault();
        event.returnValue = ''; 
      }
    };
//handlePopState is used to handling refresh and back buttons in window
    const handlePopState = (event) => {
      event.preventDefault();
      if (localStorage.getItem('codingSessionActive')) {
        const userConfirmed = window.confirm("Are you sure you want to leave the session ?");
        if (userConfirmed) {
          endSession();
        } else {
          window.history.pushState(null, document.title); // Prevent leaving
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.history.pushState(null, document.title);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [difficulty, setQuestionId]);

// handleChange handles the dynamicness of selection of difficulty level
  const handleChange = (e) => {
    const difficultySelected = e.target.value;
    setDifficulty(difficultySelected);
    localStorage.setItem('selectedDifficulty', difficultySelected);
    localStorage.removeItem('sessionQuestions'); 
    setCurrentQuestionIndex(0);
    fetchQuestions(difficultySelected); 
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setQuestionId(questions[nextIndex]._id); // Update with the new question ID
    }
  };

  // Handle navigation to the previous question
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIndex);
      setQuestionId(questions[prevIndex]._id); // Update with the previous question ID
    }
  };

  if (questions.length === 0) 
    return <div>Loading questions...</div>;

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div>
       <h2 style={{ fontWeight: 'bold' }}>
    Level: <span className={`difficulty-${difficulty.toLowerCase()}`}>
      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
    </span>
  </h2>
      <div>
      <h2 style={{ fontWeight: 'bold' }}>Change Difficulty Level: </h2>
      <div>
        <select value={difficulty || ''} onChange={handleChange} required>
          <option value="Difficulty">Select Difficulty Level</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
      <div>
        <button onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
          ← Previous
        </button>
        <button onClick={handleNext} disabled={currentQuestionIndex === questions.length - 1}>
          Next →
        </button>
      </div>
      <h2>{currentQuestion.title}</h2>
      <p>{currentQuestion.description}</p>
      <h3>Test Cases:</h3>
      <ol style={{ textAlign: 'left' }}>
        {currentQuestion.testCases.map((testCase, index) => (
          <li key={index} style={{ marginBottom: '15px' }}>
            Input: {testCase.input}
            <br />
            Expected Output: {testCase.output}
            <br />
            <br />
          </li>
        ))}
      </ol>
      </div>
    </div>
  );
};

Question.propTypes = {
  setQuestionId: PropTypes.func.isRequired,
};

export default Question;