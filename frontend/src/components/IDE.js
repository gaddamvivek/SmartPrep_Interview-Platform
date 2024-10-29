import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // For navigation after timeout
import PropTypes from 'prop-types'; 

const IDE = ({ QuestionId, savedCode, handleSaveCode,savedCodeMap }) => {
  const [code, setCode] = useState('');  // Editor code
  const [output, setOutput] = useState('');
  const [testResults, setTestResults] = useState(null);
  const [testCases, setTestCases] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(30*60); // 30 minutes in seconds
  const navigate = useNavigate(); // For navigation after interview ends
  const [userEmail, setUserEmail] = useState('');
  const [prName,setPrName]=useState('');
  // Load the saved code when the QuestionId changes
  useEffect(() => {
    setCode(savedCode || '');  // Set the editor with saved code or start with empty string
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

  const handleRun = async () => {
    try {
      const res = await axios.post('http://localhost:5001/api/submit', {
        code: code,
        testCases: testCases,
      });

      const { stdout, stderr, status } = res.data;
      const outputResult = stdout || stderr || `Execution status: ${status.description}`;
      setOutput(outputResult);

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

  try {
    const totalInterviewTimeInSeconds = 30*60 - timeRemaining; // Calculate total time taken in seconds
    const formattedTimeTaken = formatTime(totalInterviewTimeInSeconds);

    localStorage.removeItem('codingSessionActive')
    localStorage.removeItem('sessionQuestions');
    const result= await axios.post('http://localhost:5001/auth/sessions', {
      userEmail:userEmail,
      preparationName:prName,
      timeTaken:formattedTimeTaken,
      solutions:savedCodeMap  // Send all saved solutions

    });

    if (result) {
      console.log("Session saved");
    }

    // Redirect to feedback page with test case results after saving
    if (testResults) {
      navigate('/feedback', { state: { passedTestCases: testResults.passed, totalTestCases: testResults.total } });
    } else {
      navigate('/feedback', { state: { passedTestCases: 0, totalTestCases: 0 } });
    }
    alert('Session data saved successfully!');
  } catch (error) {
    console.error('Error saving session:', error);
    alert('Error saving session');
  }
};



  return (  
    <div>
      <div>
        <Editor
          height="500px"
          defaultLanguage="python"
          value={code}
          onChange={(value) => setCode(value)} 
        />
      </div>
  
      <div className="buttons">
        <p>Code Editor</p>
        <button onClick={handleSave}>Save Code</button>  
        <button onClick={handleRun}>Run</button>
        <button onClick={handleSubmit}>Submit</button>
        <button onClick={handleEndTest}>End Test</button>  {/* End Test Button */}
      </div>
  
      <pre>{output}</pre>
  
      {testResults && (
        <div className="result">
          <h3>Test Cases Passed:</h3>
          <p>
            Passed: {testResults.passed}/{testResults.total}
          </p>
          <h3>Outputs:</h3>
          <ul>
            {testResults.outputs.map((out, index) => (
              <li key={index}>{out}</li>
            ))}
          </ul>
        </div>
      )}
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
