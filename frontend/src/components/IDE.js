import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // For navigation after timeout
import PropTypes from 'prop-types'; 
import ReactMarkdown from "react-markdown";  // for parsing ai message from gemini
import remarkGfm from "remark-gfm";

const IDE = ({ QuestionId, savedCode, handleSaveCode,savedCodeMap }) => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [testResults, setTestResults] = useState(null);
  const [testCases, setTestCases] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(30 * 60);
  const [userEmail, setUserEmail] = useState('');
  const [prName, setPrName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackContent, setFeedbackContent] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  // Load the saved code when the QuestionId changes
  useEffect(() => {
    setCode(savedCode || '');  
  }, [QuestionId, savedCode]);
  
    useEffect(() => {
      // Fetch the user email from localStorage
      const storedEmail = localStorage.getItem('userEmail');
      setUserEmail(storedEmail);
    }, []);

    useEffect(()=>{
      const storedPname=localStorage.getItem('pname');
      console.log(storedPname);
      setPrName(storedPname);
    },[]);

    useEffect(()=>{
      const storedStartDate=localStorage.getItem('codingSessionStartDate');
      console.log(storedStartDate);
      setStartDate(storedStartDate);
    },[]);
    useEffect(()=>{
      const storedStartTime=localStorage.getItem('codingSessionStartTime');
      console.log(storedStartTime);
      setStartTime(storedStartTime);
    },[]);
  // Fetch test cases when QuestionId changes
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/Questions/${QuestionId}`);
        setTestCases(res.data.testCases);
      } catch (error) {
        console.error('Error fetching Question:', error);
      }
    };

    if (QuestionId) fetchQuestion();
  }, [QuestionId]);

  // Save the current code to the parent component when "Save" button is clicked
  const handleSave = () => {
    handleSaveCode(QuestionId, code);  // Call the parent function to save the code
    setSubmitted(true); // Mark as submitted
    alert("Code saved successfully")
  };

  // Interview timer countdown logic
  useEffect(() => {
    if (timeRemaining <= 0) {
      // Time is up, navigate to the feedback page
      alert("Time's up! Redirecting to the feedback page.");
      handleEndTest();
      return;
    }

    const timerInterval = setInterval(() => {
      setTimeRemaining((prevTime) => prevTime - 1);
    }, 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(timerInterval);
  }, [timeRemaining, navigate]);

  // Handle code submission to backend
  const handleSubmit = async () => {
    try{
      const result=await axios.post('http://localhost:5001/auth/testsubmit',{
      solutions:savedCodeMap
      });
      console.log("Server response:", result.data);
      if(result)
        {
          console.log("question and  saved for testing");
        }
        setSubmitted(true); // Mark as submitted
        alert('Session data saved successfully!');
      } catch (error) {
        console.error('Error saving question ans ans session:', error);
        alert('Error saving question and ans session');
      }
    try {
      const res = await axios.post('http://localhost:5001/api/submit', {
        code: code,
        testCases: testCases,
      });

      const { stdout, stderr, status } = res.data;

      // Display output result message
      const outputResult = stdout || stderr || `Execution status: ${status.description}`;
      setOutput(outputResult);


      // Test results for passed test cases
      const passedTestCases = res.data.passedTestCases || testCases.length;
      const totalTestCases = res.data.totalTestCases || testCases.length;
      setTestResults({
        passed: passedTestCases,
        total: totalTestCases,
        outputs: res.data.outputs || [],
      });
    } catch (error) {
      console.error('Error during submission:', error);
      setOutput('Error during submission');
    }
  };

const formatTime = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours}h ${minutes}m ${seconds}s`;
};


const handleEndTest = async () => {
  const today = new Date();
  const formattedDate = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
  const formattedTime = today.toLocaleTimeString('en-GB');

  try {
    const totalInterviewTimeInSeconds = 30*60 - timeRemaining; // Calculate total time taken in seconds
    const formattedTimeTaken = formatTime(totalInterviewTimeInSeconds);

    localStorage.removeItem('codingSessionActive')
    localStorage.removeItem('sessionQuestions');
    const result= await axios.post('http://localhost:5001/auth/sessions', {
      userEmail:userEmail,
      preparationName:prName,
      sessionStartDate:startDate,
      sessionEndDate:formattedDate,
      sessionStartTime:startTime,
      sessionEndTime: formattedTime,
      timeTaken:formattedTimeTaken,
      solutions:savedCodeMap  // Send all saved solutions

    });

    if (result) {
      console.log("Session saved");
    }

    // Redirect to feedback page with test case results after saving

      navigate('/feedback', {
        state: {
          userId: userEmail, // Pass user email or userId
          prName: prName,
          passedTestCases: testResults?.passed || 0,
          totalTestCases: testResults?.total || 0,
          questionId: QuestionId, // Pass the questionId
          solution: code,         // Pass the user's code solution
        }
      });

    alert('Session data saved successfully!');
  } catch (error) {
    console.error('Error saving session:', error);
    alert('Error saving session');
  }
};
const handleGetAIFeedback = async () => {
  try {
    const response = await axios.post('http://localhost:5001/api/Questions/feedback', {
      sourceCode: code,
      questionId: QuestionId,
    });

    const feedback = response.data.feedback;
    setFeedbackContent(feedback);
    setShowFeedbackModal(true); // Open the modal with feedback

  } catch (error) {
    console.log('Error getting AI feedback:', error);
    alert('Failed to get AI feedback');
  }
};



  return (  
    <div transform scale-110>
      <div>
        <Editor
          height="500px"
          defaultLanguage="python"
          options={{
            fontSize: 22, // Set the font size here
          }}
          value={code}
          onChange={(value) => setCode(value)} 
        />
      </div>
  
      <div className="buttons">
        <p>Code Editor</p>
        <button onClick={handleSave}>Save Code</button>  
        <button onClick={handleSubmit}>Submit</button>
        {submitted && (<button onClick={handleGetAIFeedback}>AI feedback</button>)}
        <button onClick={handleEndTest}>End Test</button>  {/* End Test Button */}
      </div>
      {/* Modal for AI Feedback */}
      {showFeedbackModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-1/2 h-1/2 overflow-y-auto">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">AI Feedback</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowFeedbackModal(false)}
              >
                &times;
              </button>
            </div>
            <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg max-w-3xl mx-auto">
      <ReactMarkdown
        className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl"
        remarkPlugins={[remarkGfm]}
      >
        {feedbackContent}
      </ReactMarkdown>
    </div>
            <div className="mt-6 text-right">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => setShowFeedbackModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
  
    <div className="flex-1 mt-4 overflow-auto">
      <pre className="w-full p-4 rounded-md shadow-md">{output}</pre>
    </div>
  
     
    </div>
  );
};

IDE.propTypes = {
  QuestionId: PropTypes.string.isRequired, // or .number if it's numeric
  savedCode: PropTypes.string.isRequired,
  handleSaveCode: PropTypes.func.isRequired,
  savedCodeMap: PropTypes.object.isRequired,
};

export default IDE;
