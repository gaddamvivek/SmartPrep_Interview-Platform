import React from 'react';
import UserStatCard from './userStatCard';
import { useState, useEffect } from 'react';
import axios from 'axios';

export const UserDashboardStats = ({email}) => {
  const [stats, setStats] = useState([]);
  const getStats = async () => {
    console.log('Fetching user stats...');
    try {
      const response = await axios.get(
        `http://localhost:5001/api/user/stats?email=${email}`
      );
      console.log(response.data);
      setStats(response.data);
      console.log('User stats:', response.data);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };
  useEffect(() => {
    getStats();
  }, [email]);

  if (!stats) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="grid bg-[#7360bf] text-gray-300 grid-flow-col p-10 justify-around"
      id="user-metrics"
    >
      {stats.map((stat) => (
        <UserStatCard data={stat} />
      ))}
    </div>
  );
};
