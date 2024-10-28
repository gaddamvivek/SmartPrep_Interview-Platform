import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import TechAnswerInputs from './TechAnswerInputs';
import './TechnicalInterview.css';
import Timer from './timer';

const TechnicalInterview = ({ permissions }) => {
  const [questions, setQuestions] = useState([]);
  const [difficulty, setDifficulty] = useState('easy');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [userEmail, setUserEmail] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(30 * 60);
  const navigate = useNavigate();
  const [testRun, setTestRun] = useState(true);

  useEffect(() => {
    fetchQuestions(difficulty); // Fetch questions when the component mounts or difficulty changes
  }, [difficulty]);

  const fetchQuestions = async (difficulty) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/tech/getRandomTechnicalQuestions?difficulty=${difficulty}`);
      const fetchedQuestions = response.data.slice(0, 3);
      setQuestions(fetchedQuestions); // Assuming you only want 3 questions at a time
      setCurrentQuestionIndex(0); // Reset to the first question when questions are fetched
      initializeAnswers(fetchedQuestions);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const initializeAnswers = (fetchedQuestions) => {
    const initialAnswers = {};
    fetchedQuestions.forEach((question) => {
      initialAnswers[question._id] = ''; // Initialize each question's answer with an empty string
    });
    setAnswers(initialAnswers);
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
  useEffect(() => {
    if (timeRemaining <= 0) {
      // Time is up, navigate to the feedback page
      alert("Time's up! Redirecting to the feedback page.");
      navigate('/feedback'); // Adjust the path as needed
      return;
    }

    const timerInterval = setInterval(() => {
      setTimeRemaining((prevTime) => prevTime - 1);
    }, 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(timerInterval);
  }, [timeRemaining, navigate]);

  useEffect(() => {
    // Fetch the user email from localStorage
    const storedEmail = localStorage.getItem('userEmail');
    setUserEmail(storedEmail);
  }, []);
  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };
  const submitAnswers= async () => {
    const formattedAnswers = Object.keys(answers).map((questionId) => ({
      questionId,
      answer: answers[questionId],
    }));
    try {
      const totalInterviewTimeInSeconds = 30 * 60 - timeRemaining; // Calculate total time taken in seconds
      const formattedTimeTaken = formatTime(totalInterviewTimeInSeconds);
      // Make a POST request to save the session in the database
     const result= await axios.post('http://localhost:5001/auth/tsessions', {
        userEmail:userEmail,
        timeTaken:formattedTimeTaken,
        solutions:formattedAnswers, // Send all saved solutions
      });
      if(result)
      {
        console.log("Session saved");
      }
        navigate('/feedback');
  
      alert('Session data saved successfully!');
    } catch (error) {
      console.error('Error saving session:', error);
      alert('Error saving session');
    }
  };

  return (
    <div>
      {/* Header Section */}
      <div className="header">
        <span>PrepSmart</span>
      <div className="time">
            <Timer interviewTime={900} setTestRun={setTestRun} testRun={testRun} />
          </div>
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
            currentQuestionIndex={currentQuestionIndex}
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


