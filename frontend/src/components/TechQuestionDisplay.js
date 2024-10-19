// TechQuestionDisplay.js
import React from 'react';

const TechQuestionDisplay = ({ questions, currentQuestionIndex, nextQuestion, previousQuestion }) => {
  // Log the props to ensure they are being passed correctly
  console.log('questions:', questions);
  console.log('currentQuestionIndex:', currentQuestionIndex);

  return (
    <div>
      <h2>Technical Interview Platform</h2>
      {questions.length > 0 && (
        <div>
          <h3>Question {currentQuestionIndex + 1}: {questions[currentQuestionIndex].title}</h3>
          <p>{questions[currentQuestionIndex].description}</p>
        </div>
      )}
      <div>
        <button onClick={previousQuestion} disabled={currentQuestionIndex === 0}>
          Previous Question
        </button>
        <button onClick={nextQuestion} disabled={currentQuestionIndex === questions.length - 1}>
          Next Question
        </button>
      </div>
    </div>
  );
};

export default TechQuestionDisplay;
