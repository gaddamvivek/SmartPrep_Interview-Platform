import React from 'react';
import { NavBar } from './NavBar';
import SessionManager from '../components/SessionManager';
// import interviews from '../interviewsData';
// import axios from 'axios';
import InterviewLogs from './InterviewLogs';
import UserStatCard from './userStatCard';

export const Dashboard = () => {
  // const interviewsResponse = await axios.get(`http://localhost:5001/api/interviewslogs?email=${email}`);
  return (
    <div className="h-full bg-[#e6dceb] flex flex-col justify-end font-rubik">
      <SessionManager inactivityDuration={15 * 60 * 1000} />

      <NavBar showProfile={true} showNewInterview={true} />

      <InterviewLogs email={'Arangdal@albany.edu'} />

      <hr />

      <div
        className="grid bg-[#7360bf] text-gray-300 grid-flow-col p-10 justify-around"
        id="user-metrics"
      >
        <UserStatCard username="Arangdal@albany.edu" />
      </div>
    </div>
  );
};
