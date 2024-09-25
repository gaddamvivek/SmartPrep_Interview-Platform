import React, { useState } from 'react';
import IDE from './components/IDE';
import Question from './components/Question';
import './components/ide.css'; // Import your CSS file

function App() {
  const [QuestionId, setQuestionId] = useState('');
  const handleExit = async () => {
    console.log("button was clicked");
   };
  return (
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
  );
}

export default App;

