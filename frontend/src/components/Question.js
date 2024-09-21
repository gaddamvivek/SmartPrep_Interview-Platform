import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Question = ({ setQuestionId }) => {
  const [Question, setQuestion] = useState(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/Questions/Random');
        setQuestion(res.data);
        setQuestionId(res.data._id); // Update the Question ID
      } catch (error) {
        console.error("Error fetching Question:", error);
      }
    };
    fetchQuestion();
  }, [setQuestionId]);

  if (!Question) return <div>Loading Question...</div>;

  return (
    <div>
      <h2>{Question.title}</h2>
      <p>{Question.description}</p>
      <h3>Test Cases:</h3>
      <ul>
        {Question.testCases.map((testCase, index) => (
          <li key={index}>
            Input: {testCase.input} | Expected Output: {testCase.output}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Question;
