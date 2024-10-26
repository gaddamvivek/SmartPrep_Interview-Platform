import React from 'react';
import { NavBar } from './NavBar';
import SessionManager from '../components/SessionManager';
import InterviewLogs from './InterviewLogs';
import UserStatCard from './userStatCard';
import { UserDashboardStats } from './UserDashboardStats';

export const Dashboard = () => {
  return (
    <div className="h-full bg-[#e6dceb] flex flex-col justify-end font-rubik">
      <SessionManager inactivityDuration={15 * 60 * 1000} />

      <NavBar showProfile={true} showNewInterview={true} />

      <InterviewLogs email={'Arangdal@albany.edu'} />

      <hr />

      <UserDashboardStats email={'Arangdal@albany.edu'} />
    </div>
  );
};
