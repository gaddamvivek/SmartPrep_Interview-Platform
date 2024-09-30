import React from 'react';
import { NavBar } from './NavBar';
import SessionManager from '../components/SessionManager';

export const Dashboard = () => {
  return (
    <div>
      {/* Add SessionManager to handle inactivity logout */}
      <SessionManager inactivityDuration={15 * 60 * 1000} />

      <NavBar showProfile={true} showNewInterview={true} />

      <div className="w-full h-1/2 p-10">
        <h2 className="text-3xl text-center font-semibold p-3">
          Recent Interviews
        </h2>
        <ul className="divide-y bg-[#E4B1F0] w-3/4 h-3/2 p-2 m-auto divide-gray-200">
          <li className="flex justify-between font-semibold">
            <p className="">Prep Name</p>
            <p className="">Date</p>
            <p className="">Level</p>
          </li>
          <li className="flex justify-between">
            <p className="">Python Practice</p>
            <p className="">09/28/2024</p>
            <p className="">Medium</p>
          </li>
          <li className="flex justify-between">
            <p className="">Js Beginning</p>
            <p className="">09/25/2024</p>
            <p className="">Easy</p>
          </li>
          <li className="flex justify-between">
            <p className="">React Work</p>
            <p className="">09/20/2024</p>
            <p className="">Hard</p>
          </li>
        </ul>
      </div>

      <hr />

      <div className="grid w-full bg-[#5b99c2] grid-flow-col p-10 justify-around" id="user-metrics">
        <div className="w-full rounded-md text-[#1f316f] font-semibold text-center content-center">
          <div className="text-2xl font-semibold">787</div>
          <div className="flex gap-3 justify-center">Interviews Attended</div>
          <div className="text-xs text-[#1f316f] font-normal">Sept 2024 - Present</div>
        </div>
        <div className="w-full rounded-md text-[#1f316f] font-semibold text-center content-center">
          <div className="text-2xl font-semibold">787</div>
          <div className="flex gap-3 justify-center">Interviews Attended</div>
          <div className="text-xs text-[#1f316f] font-normal">Sept 2024 - Present</div>
        </div>
      </div>
    </div>
  );
};
