import React from 'react';
import { NavBar } from './NavBar';
import SessionManager from '../components/SessionManager';
import InterviewLogs from './InterviewLogs';
import { UserDashboardStats } from './UserDashboardStats';


export const Dashboard = () => {
  const userEmail = window.localStorage.getItem('userEmail');
  return (
    <div className="h-full bg-[#e6dceb] flex flex-col justify-end font-rubik">
      <SessionManager inactivityDuration={15 * 60 * 1000} />

      <NavBar showProfile={true} showNewInterview={true} />


      <InterviewLogs email={userEmail} />

      <hr />
      <UserDashboardStats email={userEmail} />
    </div>
  );
};
