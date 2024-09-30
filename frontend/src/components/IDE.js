import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';

// Component to select a coding question based on difficulty
const QuestionSelector = ({ onQuestionSelect }) => {
  const [difficulty, setDifficulty] = useState('');
  const [error, setError] = useState('');

  const handleSelectDifficulty = async (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    try {
      const response = await axios.get(`http://localhost:5001/api/questions?difficulty=${selectedDifficulty}`);
      
      console.log(response.data);  // Log the response to check if the data is being fetched
      onQuestionSelect(response.data);  // Pass the selected question to the parent component
      setError('');
    } catch (err) {
      console.error('Error fetching question:', err);  // Log the error for debugging
      setError('No question found for the selected difficulty.');
    }
  };

  return (
    <div>
      <h2>Select Difficulty Level</h2>
      <select onChange={(e) => handleSelectDifficulty(e.target.value)}>
        <option value="">Select difficulty</option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
  
      {error && <p>{error}</p>}
    </div>
  );
};

// Component to handle the IDE (Code Editor) and the question display
const IDE = ({ question }) => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [testResults, setTestResults] = useState(null);

  const testCases = question ? question.testCases : [];

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
      {question && (
        <div>
          <h3>{question.title}</h3>
          <p>{question.description}</p>
          <p>Difficulty: {question.difficulty}</p>
        </div>
      )}

      <Editor
        height="500px"
        defaultLanguage="python"
        value={code}
        onChange={(value) => setCode(value)}
      />
      <div className="buttons">
        <p>Code Editor</p>
        <button onClick={handleSubmit}>Run</button>
        <button onClick={() => console.log("Previous button clicked")}>←</button>
        <button onClick={() => console.log("Next button clicked")}>→</button>
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

export { QuestionSelector, IDE };
