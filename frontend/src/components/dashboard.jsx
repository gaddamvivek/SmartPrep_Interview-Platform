import React, { useState } from 'react';
import { OpenEditor } from './openEditor';
import { Logout } from './logout'; // Fixed case sensitivity
import plus from '../assets/icons/plus.svg';

export const Dashboard = () => {
  const [showCodeEditor, setShowCodeEditor] = useState(false); // To toggle the code editor visibility
  //const [QuestionId, setQuestionId] = useState('');  // To manage the QuestionId state

  const openCodeEditor = () => {
    setShowCodeEditor(true); // Show the code editor when the button is clicked
  };

  return (
    <div>
      <nav className="bg-[#f9dbba] flex justify-between p-2">
        <div className="text-6xl cursor-pointer font-semibold font-mono">
          PrepSmart
        </div>
        <div className="flex items-center justify-around gap-3">
          <div className="cursor-pointer">Profile</div>
          <Logout /> {/* Logout component */}
        </div>
      </nav>
      <div
        id="action-buttons"
        className="w-full p-10 grid grid-flow-col grid-cols-4"
      >
        <div className="w-40 cursor-pointer h-40 rounded-md bg-[#f9dbba] text-[#1f316f] font-semibold text-center content-center">
          <div className="flex gap-3 justify-center">
            <img src={plus} className="w-5" alt="" />
            <span> New Interview</span>
          </div>
        </div>
        <div className="w-40 h-40 cursor-pointer rounded-md bg-[#f9dbba] text-[#1f316f] font-semibold text-center content-center">
          <div className="flex gap-3 justify-center">Interview History</div>
        </div>
      </div>
      <hr />
      <div
        className="grid w-full bg-[#5b99c2] grid-flow-col p-10 justify-around"
        id="user-metrics"
      >
        <div className="w-full rounded-md text-[#1f316f] font-semibold text-center content-center">
          <div className="text-2xl font-semibold">787</div>
          <div className="flex gap-3 justify-center">Interviews Attended</div>
          <div className="text-xs text-[#1f316f] font-normal">
            Sept 2024 - Present
          </div>
        </div>
        <div className="w-full rounded-md text-[#1f316f] font-semibold text-center content-center">
          <div className="text-2xl font-semibold">787</div>
          <div className="flex gap-3 justify-center">Interviews Attended</div>
          <div className="text-xs text-[#1f316f] font-normal">
            Sept 2024 - Present
          </div>
        </div>
      </div>
      {/*
      <button onClick={openCodeEditor}>Code Editor</button>
      
       {showCodeEditor && (
        <div>
          <OpenEditor />
        </div>
      )} */}
    </div>
  );
};
