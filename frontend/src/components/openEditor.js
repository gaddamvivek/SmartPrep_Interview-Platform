
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Logout } from './logout';
import IDE from './IDE';
import './ide.css'; // Import your CSS file
import Question from './Question';
import Timer from './timer';

export const OpenEditor = (props) => {
  const [QuestionId, setQuestionId] = useState('');  // To manage the QuestionId state
  const [savedCode, setSavedCode] = useState({});    // State to store saved code for each question
  const [testRun, setTestRun] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');

  const handleProfileButton = () => {
    console.log("Profile button clicked");  // Debugging log for button click
    setIsProfileOpen((prevState) => !prevState);
  };

  const showProfile = props.showProfile || false;
  useEffect(() => {
    console.log("showProfile prop:", showProfile);  // Debugging log for showProfile prop

    // Retrieve user info from localStorage
    const userEmail = localStorage.getItem('userEmail');
    const uName = localStorage.getItem('userName');

    setEmail(userEmail);
    setUserName(uName);
  }, []);

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
            <Timer interviewTime={1800} setTestRun={setTestRun} testRun={testRun} />
          </div>
        <div className="flex font-semibold relative items-center justify-end gap-3">
          <div
            onClick={handleProfileButton}
            className="relative cursor-pointer text-white"
          >
            Profile
          </div>
          {isProfileOpen && (
            <div className="profile-dropdown ">
              <div className="">
                {userName}
              </div>
              <div className="" id="profile-email">
                {email}
              </div>
              <hr />
              <Logout />
            </div>
          )}
        </div>

          
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

OpenEditor.propTypes = {
  showProfile: PropTypes.bool,
};
