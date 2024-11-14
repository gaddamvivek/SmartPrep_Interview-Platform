import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Logout } from './logout';
import TechAnswerInputs from './TechAnswerInputs';
import './TechnicalInterview.css';
import Timer from './timer';

const TechnicalInterview = ({ permissions, showProfile }) => {
  const [questions, setQuestions] = useState([]);
  const [difficulty, setDifficulty] = useState('easy');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(30*60);
  const navigate = useNavigate();
  const [testRun, setTestRun] = useState(true);
  const [prName,setPrName]=useState('');
  const [tstartDate,setTstartDate]=useState('');
  const [tstartTime,settStartTime]=useState('');

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

  const handleProfileButton = () => {
    console.log("Profile button clicked");  // Debugging log for button click
    setIsProfileOpen((prevState) => !prevState);
  };

  useEffect(() => {
    console.log("showProfile prop:", showProfile);  // Debugging log for showProfile prop

    // Retrieve user info from localStorage
    const userEmail = localStorage.getItem('userEmail');
    const uName = localStorage.getItem('userName');

    setEmail(userEmail);
    setUserName(uName);
  }, []);

  const handleSpeech = () => {
    const syn = window.speechSynthesis;

    const speakQuestion = () => {
        const voices = syn.getVoices();
        const userVoiceChoice = localStorage.getItem('voiceType');
        console.log("Available voices:", voices);  // Log available voices for debugging

        // Check if voices are available
        if (voices.length === 0) {
            console.error("No voices are available");
            return;
        }

        // Select voice based on user preference
        let selectedVoice;
        if (userVoiceChoice === 'Female') {
            selectedVoice = voices.find(voice => voice.lang === "en-GB" && voice.name.includes("Female")) || voices[0];
        } else {
            selectedVoice = voices.find(voice => voice.lang === "en-GB" && voice.name.includes("Male")) || voices[0];
        }

        const currentQuestion = questions[currentQuestionIndex].title;
        const utterance = new SpeechSynthesisUtterance(currentQuestion);
        utterance.voice = selectedVoice;
        syn.speak(utterance);
    };

    // Check if voices are already available
    if (syn.getVoices().length > 0) {
        speakQuestion();
    } else {
        // Wait for voices to load if not already available
        syn.addEventListener("voiceschanged", speakQuestion);
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
  useEffect(() => {
    if (timeRemaining <= 0) {
      // Time is up, navigate to the feedback page
      alert("Time's up! Redirecting to the feedback page.");
      submitAnswers(); // Adjust the path as needed
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
  // Fetch the user preparation name from localStorage
  useEffect(()=>{
    const storedPname=localStorage.getItem('pname');
    console.log(storedPname);
    setPrName(storedPname);
  },[]);
  useEffect(()=>{
    const storedStartDate=localStorage.getItem('technicalSessionStartDate');
    console.log(storedStartDate);
    setTstartDate(storedStartDate);
  },[]);
  useEffect(()=>{
    const storedStartTime=localStorage.getItem('technicalSessionStartTime');
    console.log(storedStartTime);
    settStartTime(storedStartTime);
  },[]);
  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  /*const submitAnswers = async () => {
   // const intervieweeId = '12345'; // Replace with actual interviewee ID
    const formattedAnswers = Object.keys(answers).map((questionId) => ({
      questionId,
      answer: answers[questionId],
    }));

    try {
      const totalInterviewTimeInSeconds = 30 * 60 - timeRemaining; // Calculate total time taken in seconds
      const formattedTimeTaken = formatTime(totalInterviewTimeInSeconds);
      await axios.post('http://localhost:5001/api/submit-answers', {
        userEmail:userEmail,
        timeTaken:formattedTimeTaken,
        answers: formattedAnswers,
      });
      alert('Answers submitted successfully');
    } catch (error) {
      console.error('Error submitting answers:', error);
      alert('Error submitting answers');
    }
  };*/
  const submitAnswers= async () => {
    const today = new Date();
    const formattedDate = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
    const formattedTime = today.toLocaleTimeString('en-GB');
    const formattedAnswers = Object.keys(answers).map((questionId) => ({
      questionId,
      answer: answers[questionId],
    }));
    try {
      const totalInterviewTimeInSeconds = 30*60 - timeRemaining; // Calculate total time taken in seconds
      const formattedTimeTaken = formatTime(totalInterviewTimeInSeconds);
     const result= await axios.post('http://localhost:5001/auth/tsessions', {
        userEmail:userEmail,
        preparationName:prName,
        sessionStartDate:tstartDate,
        sessionEndDate:formattedDate,
        sessionStartTime:tstartTime,
        sessionEndTime:formattedTime,
        timeTaken:formattedTimeTaken,
        answers:formattedAnswers, // Send all saved solutions
      });
      if(result)
      {
        console.log("Session saved");
      }
      navigate('/technicalFeedback', { state: { userEmail, preparationName: prName } });
  
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
        <div className="heading shadow-lg shadow-black font-semibold text-2xl">
          <h1>PrepSmart</h1>
          <div className="rtime">
            <Timer interviewTime={1800} setTestRun={setTestRun} testRun={testRun} />
          </div>
          
          {/* Profile Dropdown */}
          <div className="flex font-semibold relative items-center justify-end gap-3">
            <div
              onClick={handleProfileButton}
              className="relative cursor-pointer"
            >
              Profile
            </div>
            {isProfileOpen && (
              <div className="profile-dropdown">
                <div>{userName}</div>
                <div id="profile-email">{email}</div>
                <hr />
                <Logout />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="technical-interview-container">
        
        {/* Left Section: Questions */}
        <div className="question-section">
          <h2 style={{ fontWeight: 'bold' }}>Technical Interview</h2>

          <h2 style={{ fontWeight: 'bold' }}>
              Level: <span className={`difficulty-${difficulty.toLowerCase()}`}>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </span>
            </h2>


          <div className="difficulty-selection">
            <label style={{ fontWeight: 'bold' }}>Change Difficulty Level: </label>
            <select value={difficulty || ''} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="">Select Difficulty Level</option>
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
  showProfile: PropTypes.bool.isRequired,
};

// TechnicalInterview.propTypes = {
//   // showSignIn: PropTypes.bool,
//   showProfile: PropTypes.bool,
// };

export default TechnicalInterview;


