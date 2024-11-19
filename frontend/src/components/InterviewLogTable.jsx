import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const InterviewLogTable = ({ data }) => {
  const navigate = useNavigate();

  return (
    <ul className="divide-y rounded-xl bg-[#d2bceb] p-2 m-auto divide-gray-300 shadow-gray-500 shadow-lg">
      <li className="grid grid-cols-5 text-xl font-bold p-2">
        <p>Name</p>
        <p>Position</p>
        <p>Difficulty</p>
        <p>Date</p>
        <p>Time Taken</p>
      </li>
      {data.map((item, index) => (
        <li
          onClick={() => {
            navigate(`/feedback`, {
              state: { userId: item.userEmail, prName: item.preparationName },
            });
          }}
          key={index}
          className="grid cursor-pointer grid-cols-5 text-nowrap text-lg p-2 hover:bg-[#e0c3d4]"
        >
          <p>{item.preparationName}</p>
          <p>{item.positionName}</p>
          <p>{item.prepDiff}</p>
          <p>{item.sessionStartDate}</p>
          <p>{item.timeTaken}</p>
        </li>
      ))}
    </ul>
  );
};

// Prop validation
InterviewLogTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      userEmail: PropTypes.string.isRequired,
      preparationName: PropTypes.string.isRequired,
      positionName: PropTypes.string.isRequired,
      prepDiff: PropTypes.string.isRequired,
      sessionStartDate: PropTypes.string.isRequired,
      timeTaken: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default InterviewLogTable;
