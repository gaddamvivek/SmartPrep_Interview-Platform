import React from 'react';
import PropTypes from 'prop-types';
import UserStatCard from './userStatCard';
import StreakCard from './StreakCard';
import { useState, useEffect } from 'react';
import axios from 'axios';

export const UserDashboardStats = ({ email }) => {
  const [stats, setStats] = useState([]);
  const [streak, setStreak] = useState([]);
  
  const getStats = async () => {
    console.log('Fetching user stats...');
    try {
      const response = await axios.get(
        `https://icsi518-team1-prepsmart.onrender.com/api/user/stats?email=${email}`
       // `http://localhost:5001/api/user/stats?email=${email}`
      );
      console.log(response.data);
      setStats(response.data);
      console.log('User stats:', response.data);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const getStreak = async () => {
    console.log('Fetching user streak...');
    try {
      const response = await axios.get(
        `https://icsi518-team1-prepsmart.onrender.com/api/user/streak?email=${email}`
       // `http://localhost:5001/api/user/streak?email=${email}`
      );
      console.log(response.data);
      setStreak(response.data);
      console.log('User streak:', response.data);
    } catch (error) {
      console.error('Error fetching user streak:', error);
    }
  };

  useEffect(() => {
    getStats();
    getStreak();
  }, [email]);

  if (!stats || !streak) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div
        className="grid bg-[#7360bf] text-gray-300 grid-flow-col p-10 justify-around"
        id="user-metrics"
      >
        {stats.map((stat, index) => (
          <UserStatCard key={`stat-${index}`} data={stat} />
        ))}
      </div>
      <div className="p-10">
        <StreakCard data={streak} />
      </div>
    </>
  );
};

UserDashboardStats.propTypes = {
  email: PropTypes.string.isRequired
};

export default UserDashboardStats;