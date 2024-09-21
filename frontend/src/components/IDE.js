import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';

// IDE renders the Question based on QuestionId
const IDE = ({ QuestionId }) => {
  const [code, setCode] = useState(''); 
  const [output, setOutput] = useState('');
  const [testResults, setTestResults] = useState(null);
  const [testCases, setTestCases] = useState([]);

  // Fetch Question including test cases when Question component mounts
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/Questions/${QuestionId}`);
        setTestCases(res.data.testCases); // Assuming your API returns test cases in this structure
      } catch (error) {
        console.error('Error fetching Question:', error);
      }
    };

    fetchQuestion();
  }, [QuestionId]);

  const handleSubmit = async () => {
    try {
      const res = await axios.post('http://localhost:5001/api/submit', {
        code: code,
        testCases: testCases, // Send fetched test cases to server
      });

      const { stdout, stderr, status } = res.data;

      // Display output Result message
      const outputResult = stdout || stderr || `Execution status: ${status.description}`;
      setOutput(outputResult);

      // Test results for passed test cases are yet to be handled

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

  // Outputs to the coding question must be handled mentioning number of test cases passed is to be handled.
  
  return (
    <div>
      <Editor
        height="400px"
        defaultLanguage="python"
        value={code}
        onChange={(value) => setCode(value)}
      />
      <button onClick={handleSubmit}>Run</button>
      <pre>{output}</pre>
      {testResults && (
        <div>
          <h3>Test Results:</h3>
          <p>
            Passed: {testResults.passed}/{testResults.total}
          </p>
          <h4>Outputs:</h4>
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

export default IDE;
