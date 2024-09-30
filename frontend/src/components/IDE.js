import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // For navigation after timeout
import PropTypes from 'prop-types'; 

const IDE = ({ QuestionId, savedCode, handleSaveCode }) => {
  const [code, setCode] = useState('');  // Editor code
  const [output, setOutput] = useState('');
  const [testResults, setTestResults] = useState(null);
  const [testCases, setTestCases] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes in seconds
  const navigate = useNavigate(); // For navigation after interview ends

  // Load the saved code when the QuestionId changes
  useEffect(() => {
    setCode(savedCode || '');  // Set the editor with saved code or start with empty string
  }, [QuestionId, savedCode]);

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
      navigate('/feedback'); // Adjust the path as needed
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

  // Format timeRemaining into minutes and seconds
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
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


  return (  
      <div>
        <Editor
          height="500px"
          defaultLanguage="python"
          value={code}
          onChange={(value) => setCode(value)}  // Update code as user types
        />
      </div>
  
      <div className="buttons">
        <p>Code Editor</p>
        <button onClick={handleSave}>Save Code</button>  {/* Save Button */}
        <button onClick={handleRun}>Run</button>
        <button onClick={handleSubmit}>Submit</button>
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
};

export default IDE;
