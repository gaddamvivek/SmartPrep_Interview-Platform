import React, { useEffect, useState } from 'react';
import InterviewLogTable from './InterviewLogTable';
import axios from 'axios';
const InterviewLogs = ({ email }) => {
  // const logTypes = ['Technical Questions', 'Coding'];
  const [logs, setLogs] = useState([]);
  useEffect(() => {
    console.log('helllo');
    const fetchLogs = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/user/interviewlogs?email=${email}`
        );
        console.log(response.data);
        setLogs(response.data);
      } catch (error) {
        console.error('Error fetching interview logs:', error);
      }
    };

    fetchLogs();
  }, [email]);
  if (!logs) {
    return <div>Loading...</div>;
  }
  return (
    <div className="w-full p-10">
      <h2 className="text-3xl text-center font-semibold p-3">
        Recent Interviews
      </h2>
      <div className="grid grid-cols-2">
        {logs.map((item) => (
          <div key={item.title} className="p-3">
            <h3 className="text-2xl text-center font-semibold">{item.title}</h3>
            <InterviewLogTable data={item.data} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterviewLogs;
