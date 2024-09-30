import React, { useState } from 'react';
import { IDE, QuestionSelector } from './IDE';  
import './ide.css'; // Import your CSS file
import Question from './Question';

export const OpenEditor = () => {
  const [QuestionId, setQuestionId] = useState('');  // To manage the QuestionId state
  const handleExit = async () => {
    console.log("Button is clicked");
   };

  return (
    <div>
        <div className="app">
          <div className="heading">
            <h1>PrepSmart</h1>
            <button onClick={handleExit}>End Test</button>
          </div>
          <div className="content">
            {/* Pass setQuestionId as a prop */}
            <div className="question">
              <Question setQuestionId={setQuestionId} />
            </div>
            {/* Pass QuestionId to IDE */}
            <div className="editor">
              <IDE QuestionId={QuestionId} />
            </div>
          </div>
        </div>
    </div>
  );
};