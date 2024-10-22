import React from 'react';
import { NavBar } from './NavBar';
import SessionManager from '../components/SessionManager';
import interviews from '../interviewsData';

export const Dashboard = () => {
  return (
    <div className="h-full bg-[#e6dceb] flex flex-col justify-end font-rubik">
      <SessionManager inactivityDuration={15 * 60 * 1000} />

      <NavBar showProfile={true} showNewInterview={true} />

      <div className="w-full p-10">
        <h2 className="text-3xl text-center font-semibold p-3">
          Recent Interviews
        </h2>
        <ul className="divide-y rounded-xl bg-[#d2bceb] w-1/2 h-3/2 p-2 m-auto divide-gray-300 shadow-gray-500 shadow-lg">
          <li className="flex justify-between text-xl font-bold p-2">
            <p className="">Prep Name</p>
            <p className="">Date</p>
            <p className="">Level</p>
          </li>
          {interviews.map((item, index) => {
            return (
              <li
                key={index}
                className="flex justify-between text-xl font-bold p-2"
              >
                <p className="">{item.prepName}</p>
                <p className="">{item.date}</p>
                <p className="">{item.level}</p>
              </li>
            );
          })}
        </ul>
      </div>

      <hr />

      <div
        className="grid bg-[#7360bf] text-gray-300 grid-flow-col p-10 justify-around"
        id="user-metrics"
      >
        <div className="w-full rounded-md  font-semibold text-center content-center">
          <div className="text-2xl font-semibold">787</div>
          <div className="flex gap-3 justify-center">Interviews Attended</div>
          <div className="text-xs  font-normal">Sept 2024 - Present</div>
        </div>
        <div className="w-full rounded-md  font-semibold text-center content-center">
          <div className="text-2xl font-semibold">787</div>
          <div className="flex gap-3 justify-center">Interviews Attended</div>
          <div className="text-xs  font-normal">Sept 2024 - Present</div>
        </div>
      </div>
    </div>
  );
};
