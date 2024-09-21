import React, { useState } from 'react';
import IDE from './components/IDE';
import Question from './components/Question';

function App() {
  const [QuestionId, setQuestionId] = useState('');

  return (
    <div>
      <h1>PrepSmart Coding Interview Platform</h1>
      {/* Pass setQuestionId as a prop */}
      <Question setQuestionId={setQuestionId} />
      {/* Pass QuestionId to IDE */}
      <IDE QuestionId={QuestionId} />
    </div>
  );
}

export default App;
