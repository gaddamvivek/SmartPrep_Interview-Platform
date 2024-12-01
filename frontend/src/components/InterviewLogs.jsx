
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import InterviewLogTable from './InterviewLogTable';
import axios from 'axios';

const InterviewLogs = ({ email }) => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/user/interviewlogs?email=${email}`
        );
        console.log('Logs fetched:', response.data); // Debug logs
        setLogs(response.data);
      } catch (error) {
        console.error('Error fetching interview logs:', error);
      }
    };

    fetchLogs();
  }, [email]);

  if (!logs || logs.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full p-10">
      <h2 className="text-3xl text-center font-semibold p-3">Recent Interviews</h2>
      <div className="grid grid-cols-2">
        {logs.map((item, index) => (
          <div key={index} className="p-3">
            <h3 className="text-2xl text-center font-semibold">{item.title}</h3>
            {/* Pass the title to InterviewLogTable */}
            <InterviewLogTable data={item.data} title={item.title} />
          </div>
        ))}
      </div>
    </div>
  );
};

InterviewLogs.propTypes = {
  email: PropTypes.string.isRequired,
};

export default InterviewLogs;