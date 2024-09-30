import React, { useState } from 'react';
import { LoginSignup } from './components/login';
import { Dashboard } from './components/dashboard';
import { Signup } from './components/signup';
import { IDE, QuestionSelector } from './components/IDE';
 // Import the IDE components
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

function App() {
  const [selectedQuestion, setSelectedQuestion] = useState(null);  // State to hold the selected question

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<LoginSignup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/signup" element={<Signup />} />

          {/* New route for the coding IDE */}
          <Route
            path="/ide"
            element={
              <div>
                <QuestionSelector onQuestionSelect={setSelectedQuestion} />
                {selectedQuestion && <IDE question={selectedQuestion} />}  {/* Render IDE when a question is selected */}
              </div>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
