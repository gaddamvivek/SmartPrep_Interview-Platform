import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import './ide.css';
import { useNavigate } from 'react-router-dom';
import SpchLogo from '../assets/images/spch.png';
import rightIcon from '../assets/icons/right-icon.png';
import leftIcon from '../assets/icons/left-icon.png';

const Question = ({ setQuestionId }) => {
  const [questions, setQuestions] = useState([]);
  const [difficulty, setDifficulty] = useState('');
  const [queue, setQueue] = useState([]);
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
      let position = localStorage.getItem('selectedPosition');
      let companyName = localStorage.getItem('companySelected');
      const res = await axios.get(
        `http://localhost:5001/api/questions/Random?difficulty=${selectedDifficulty}&position=${position}&company=${companyName}`
      );
      const fetchedQuestions = res.data;
      setQuestions(fetchedQuestions);
      setQueue(fetchedQuestions);
      localStorage.setItem(
        'sessionQuestions',
        JSON.stringify(fetchedQuestions)
      );
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
      setQueue(localQuestions);
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
        const userConfirmed = window.confirm(
          'Are you sure you want to leave the session ?'
        );
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

  const handleSpeech = () => {
    const syn = window.speechSynthesis;

    const speakQuestion = () => {
      const voices = syn.getVoices();
      const userVoiceChoice = localStorage.getItem('voiceType');
      console.log('Available voices:', voices); // Log available voices for debugging

      // Check if voices are available
      if (voices.length === 0) {
        console.error('No voices are available');
        return;
      }

      // Select voice based on user preference
      let selectedVoice;
      if (userVoiceChoice === 'Female') {
        selectedVoice =
          voices.find(
            (voice) => voice.lang === 'en-GB' && voice.name.includes('Female')
          ) || voices[0];
      } else {
        selectedVoice =
          voices.find(
            (voice) => voice.lang === 'en-GB' && voice.name.includes('Male')
          ) || voices[0];
      }

      const currentQuestion = questions[currentQuestionIndex].title;
      const currentQuestionDesc = questions[currentQuestionIndex].description;
      const utterance = new SpeechSynthesisUtterance(currentQuestion);
      const utterance2 = new SpeechSynthesisUtterance(currentQuestionDesc);
      utterance.voice = selectedVoice;
      utterance2.voice = selectedVoice;
      syn.speak(utterance);
      syn.speak(utterance2);
    };

    // Check if voices are already available
    if (syn.getVoices().length > 0) {
      speakQuestion();
    } else {
      // Wait for voices to load if not already available
      syn.addEventListener('voiceschanged', speakQuestion);
    }
  };

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

  if (questions.length === 0) return <div>Loading questions...</div>;

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div>
      <h2 style={{ fontWeight: 'bold' }}>
        Level:{' '}
        <span className={`difficulty-${difficulty.toLowerCase()}`}>
          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </span>
      </h2>
      <div>
        <div className="flex items-center gap-2">
          <h2 style={{ fontWeight: 'bold' }}>Change Difficulty Level: </h2>
          <div className="p-1 bg-white rounded-md border">
            <select
              value={difficulty || ''}
              onChange={handleChange}
              className="outline-none"
              required
            >
              <option value="Difficulty">Select Difficulty Level</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>
        {/* <div>
        <button onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
          ← Previous
        </button>
        <button onClick={handleNext} disabled={currentQuestionIndex === questions.length - 1}>
          Next →
        </button>
      </div>
      
      */}

        <div
          className="questions-queue flex gap-2 justify-center"
          style={{ marginTop: '12px' }}
        >
          <button
            className="arrow"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            <img src={leftIcon} alt="left-icon" className="w-6" />
          </button>
          <div className="queue-numbers">
            {queue.map((_, index) => (
              <div
                key={index}
                className={`queue-number ${index === currentQuestionIndex ? 'current' : ''}`}
                onClick={() => {
                  setCurrentQuestionIndex(index);
                  setQuestionId(questions[index]._id); // Update the question ID whenever the index changes
                }}
              >
                {index + 1}
              </div>
            ))}
          </div>
          <button
            className="arrow"
            onClick={handleNext}
            disabled={currentQuestionIndex === questions.length - 1}
          >
            <img src={rightIcon} alt="right-icon" className="w-6" />
          </button>
        </div>

        <h3 className="font-semibold text-lg">
          <span className="text-gray-700">Question:</span>{' '}
          {questions[currentQuestionIndex].title}
        </h3>

        <div style={{ display: 'inline', alignItems: 'center' }}>
          <p style={{ margin: 0 }}>
            {questions[currentQuestionIndex].description}
          </p>
          <div className="p-2 hover:bg-purple-400 rounded-md w-fit">
            <img
              src={SpchLogo}
              alt="Speech"
              className="SpchBtnImage"
              onClick={handleSpeech}
              style={{ cursor: 'pointer' }}
            />
          </div>
        </div>

        <h3 style={{ fontWeight: 'bold' }}>Test Cases:</h3>
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
