import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';

const IDE = ({ QuestionId, savedCode, handleSaveCode }) => {
  const [code, setCode] = useState('');  // Editor code
  const [output, setOutput] = useState('');
  const [testResults, setTestResults] = useState(null);
  const [testCases, setTestCases] = useState([]);

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

  const handleSubmit = async () => {
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
      <div className="buttons">
        <p>Code Editor</p>
        <button onClick={handleSave}>Save Code</button>  {/* Save Button */}
        <button onClick={handleSubmit}>Run</button>
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

export default IDE;
