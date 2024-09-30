import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Question = ({ setQuestionId }) => {
  const [questions, setQuestions] = useState([]); // Store array of questions
  const [difficulty, setDifficulty] = useState('easy'); // Track selected difficulty
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track current question

  // Fetch an array of 3 questions

  const fetchQuestions = async (selectedDifficulty) => {
    try {
      const res = await axios.get(`http://localhost:5001/api/questions/Random?difficulty=${selectedDifficulty}`);
      setQuestions(res.data); // Assuming the API returns an array of 3 questions
      setQuestionId(res.data[0]._id); // Set the first question ID
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };
  useEffect(() => {
    if (difficulty) {
      fetchQuestions(difficulty);
    }
  }, [difficulty]);

  // Handle navigation to the next question
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

  // Display the current question
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div>
      <h2>Select Difficulty Level</h2>
      <div>
        {/* Difficulty buttons */}
        <button onClick={() => setDifficulty('easy')}>Easy</button>
        <button onClick={() => setDifficulty('medium')}>Medium</button>
        <button onClick={() => setDifficulty('hard')}>Hard</button>
      </div>
      <div>
        <button onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
          ← Previous
        </button>
        <button onClick={handleNext} disabled={currentQuestionIndex === questions.length - 1}>
          Next →
        </button>
      </div>
      <h2>{currentQuestion.title}</h2>
      <p>{currentQuestion.description}</p>
      <h3>Test Cases:</h3>
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
  );
};

export default Question;
