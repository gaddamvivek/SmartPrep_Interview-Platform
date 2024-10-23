import React from 'react';
import axios from 'axios';
// import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
const UserStatCard = ({ username }) => {
  const [stats, setStats] = useState(null);
  const getStats = async () => {
    console.log('Fetching user stats...');
    try {
      const response = await axios.get(
        `http://localhost:5001/api/user/stats?email=${username}`
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
  }, [username]);

  if (!stats) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full rounded-md font-semibold text-center content-center">
      <div className="text-2xl font-semibold">{stats.interviewsAttended}</div>
      <div className="flex gap-3 justify-center">Interviews Attended</div>
      <div className="text-xs font-normal">something</div>
    </div>
  );
};

// UserStatCard.propTypes = {
//   username: PropTypes.string,
// };

export default UserStatCard;
