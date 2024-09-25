import React, { useState } from 'react';
import { OpenEditor } from './openEditor';
import { Logout } from './logout';  // Fixed case sensitivity

export const Dashboard = () => {
  const [showCodeEditor, setShowCodeEditor] = useState(false);  // To toggle the code editor visibility
  //const [QuestionId, setQuestionId] = useState('');  // To manage the QuestionId state

  const openCodeEditor = () => {
    setShowCodeEditor(true);  // Show the code editor when the button is clicked
  };

  return (
    <div>
      <h1>This is a Dashboard page</h1>
      <Logout />  {/* Logout component */}
      <button onClick={openCodeEditor}>Code Editor</button>
      
      {/* Conditionally render the code editor */}
      {showCodeEditor && (
        <div>
          <OpenEditor />
        </div>
      )}
    </div>
  );
};
