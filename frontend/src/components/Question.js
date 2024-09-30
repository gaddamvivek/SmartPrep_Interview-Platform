import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Question = ({ setQuestionId }) => {
  const [question, setQuestion] = useState(null);
  const [difficulty, setDifficulty] = useState(''); // Track selected difficulty
  const [error, setError] = useState(null); // Track any errors

  const fetchQuestion = async (selectedDifficulty) => {
    try {
      const res = await axios.get(`http://localhost:5001/api/questions/Random?difficulty=${selectedDifficulty}`);
      setQuestion(res.data);
      setQuestionId(res.data._id);  // Pass the question ID to the parent if necessary
      setError(null); // Reset error state if a question is found
    } catch (error) {
      console.error("Error fetching question:", error);
      setError('No question found for the selected difficulty.'); // Set error message if no question is found
      setQuestion(null); // Clear any existing question
    }
  };

  useEffect(() => {
    if (difficulty) {
      fetchQuestion(difficulty);
    }
  }, [difficulty]);

  return (
    <div>
      <h2>Select Difficulty Level</h2>
      <div>
        {/* Difficulty buttons */}
        <button onClick={() => setDifficulty('easy')}>Easy</button>
        <button onClick={() => setDifficulty('medium')}>Medium</button>
        <button onClick={() => setDifficulty('hard')}>Hard</button>
      </div>

      {error && <p>{error}</p>} {/* Display error message if no question is found */}

      {question && (
        <div>
          <h2>{question.title}</h2>
          <p>{question.description}</p>
          <h3>Test Cases:</h3>
          <ol style={{ textAlign: 'left' }}>
            {question.testCases.map((testCase, index) => (
              <li key={index} style={{ marginBottom: '15px' }}>
                Input: {testCase.input}
                <br />
                Expected Output: {testCase.output}
                <br /><br />
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default Question;

