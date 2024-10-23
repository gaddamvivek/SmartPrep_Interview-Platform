import React, { useEffect, useState } from 'react';
import axios from 'axios';

const InterviewLogs = ({ email }) => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/user/interviewlogs?email=${email}`
        );
        setLogs(response.data);
      } catch (error) {
        console.error('Error fetching interview logs:', error);
      }
    };

    fetchLogs();
  }, [email]);

  return (
    <div className="w-full p-10">
      <h2 className="text-3xl text-center font-semibold p-3">
        Recent Interviews
      </h2>
      <ul className="divide-y rounded-xl bg-[#d2bceb] w-1/2 p-2 m-auto divide-gray-300 shadow-gray-500 shadow-lg">
        <li className="grid grid-cols-4 text-xl font-bold p-2">
          <p className="">Prep Name</p>
          <p className="">Date</p>
          <p className="">Type</p>
          <p className="">Level</p>
        </li>
        {logs.map((item, index) => {
          console.log(item);
          return (
            <li key={index} className="grid grid-cols-4 text-nowrap text-lg p-2">
              <p className="">{item.prepname}</p>
              <p className="">
                {new Date(item.date).toLocaleDateString('en-US', {
                  month: '2-digit',
                  day: '2-digit',
                  year: 'numeric',
                })}
              </p>
              <p className="">{item.slctround}</p>
              <p className="">{item.diffLvl}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default InterviewLogs;
