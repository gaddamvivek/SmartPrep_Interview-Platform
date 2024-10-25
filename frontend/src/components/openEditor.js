import React, { useState } from 'react';
import IDE from './IDE';
import './ide.css'; // Import your CSS file
import Question from './Question';
import Timer from './timer';

export const OpenEditor = () => {
  const [QuestionId, setQuestionId] = useState('');  // To manage the QuestionId state
  const [savedCode, setSavedCode] = useState({});    // State to store saved code for each question
  const [testRun, setTestRun] = useState(true);
  // const handleExit =() => {
  //   setTestRun(false);
  //   console.log("Test Ended");
  //  };
  // Function to handle saving code for a specific question
  const handleSaveCode = (QuestionId, code) => {
    setSavedCode((prevSavedCode) => ({
      ...prevSavedCode,
      [QuestionId]: code,  // Save the code for the current QuestionId
    }));
  };

  return (
    <div className='bg-[#e6dceb]'>
      <div className="app">
        <div className="heading shadow-lg shadow-black font-semibold text-2xl">
          <h1>PrepSmart</h1>
          <div className="rtime">
            <Timer interviewTime={30} setTestRun={setTestRun} testRun={testRun} />
          </div>
          {/*<button onClick={handleExit}>End Test</button>*/}
        </div>
        <div className="content">
          {/* Pass setQuestionId as a prop */}
          <div className="question">
            <Question setQuestionId={setQuestionId} />
          </div>
          {/* Pass QuestionId, savedCode, and handleSaveCode to IDE */}
          <div className="editor">
            <IDE
              QuestionId={QuestionId}
              savedCode={savedCode[QuestionId] || ''} // Load saved code or empty string
              handleSaveCode={handleSaveCode}        // Pass save function to IDE
              savedCodeMap={savedCode}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
