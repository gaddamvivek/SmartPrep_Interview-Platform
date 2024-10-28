import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const InterviewLogTable = ({ email, type }) => {
  const [logs, setLogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/user/interviewlogs?email=${email}&type=${type}`
        );
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
    <ul className="divide-y rounded-xl bg-[#d2bceb] p-2 m-auto divide-gray-300 shadow-gray-500 shadow-lg">
      <li className="grid grid-cols-3 text-xl font-bold p-2">
        <p className="">Prep Name</p>
        <p className="">Date</p>
        <p className="">Level</p>
      </li>
      {logs.map((item, index) => {
        console.log(item);
        return (
          <li
            onClick={() => {
              navigate(`/feedback/${item._id}`);
            }}
            key={index}
            className="grid cursor-pointer grid-cols-3 text-nowrap text-lg p-2"
          >
            <p className="">{item.prepname}</p>
            <p className="">
              {new Date(item.date).toLocaleDateString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric',
              })}
            </p>
            <p className="">{item.diffLvl}</p>
          </li>
        );
      })}
    </ul>
  );
};

export default InterviewLogTable;
