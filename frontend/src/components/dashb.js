import React, { useState } from 'react';
import { OpenEditor } from './openEditor';
import { InterviewDetails } from './interviewDetails';
import { Logout } from './logout';  // Fixed case sensitivity

export const Dashboard = () => {
  const [showCodeEditor, setShowCodeEditor] = useState(false);  // To toggle the code editor visibility
  const [showID, setShowID] = useState(false);
  //const [QuestionId, setQuestionId] = useState('');  // To manage the QuestionId state

  const openCodeEditor = () => {
    setShowCodeEditor(true);  // Show the code editor when the button is clicked
  };
  const open = () => {
    setShowID(true);  // Show the code editor when the button is clicked
  };

  return (
    <div>
      <h1>This is a Dashboard page</h1>
      <Logout />  {/* Logout component */}
      <button onClick={openCodeEditor}>Code Editor</button>
      <button onClick={open}>Interview Details </button>
      
      {/* Conditionally render the code editor */}
      {showCodeEditor && (
        <div>
          <OpenEditor />
        </div>
        
      )}
      {showID && (
        <div>
          <InterviewDetails />
        </div>
        
      )}
    </div>
  );
};
