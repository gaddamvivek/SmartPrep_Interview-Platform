import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const InterviewLogTable = ({ data, title }) => {
  const navigate = useNavigate();

  const handleRowClick = (item) => {
    if (item.userEmail && item.preparationName) {
      if (title?.includes('Technical')) { // Check if title includes 'Technical'
        navigate('/technicalFeedback', {
          state: {
            userId: item.userEmail,
            prName: item.preparationName,
          },
        });
      } else if (title?.includes('Coding')) { // Check if title includes 'Coding'
        navigate('/feedback', {
          state: {
            userId: item.userEmail,
            prName: item.preparationName,
          },
        });
      } else {
        console.error('Unable to determine interview type', { item, title });
      }
    } else {
      console.error('Missing user information', item);
    }
  };

  return (
    <ul className="divide-y rounded-xl bg-[#d2bceb] p-2 m-auto divide-gray-300 shadow-gray-500 shadow-lg">
      <li className="grid grid-cols-5 text-xl font-bold p-2">
        <p className="truncate" title='Name'>Name</p>
        <p className="truncate" title='Position'>Position</p>
        <p className="truncate" title='Difficulty'>Difficulty</p>
        <p className="truncate" title='Date'>Date</p>
        <p className="truncate" title='Time Taken'>Time Taken</p>
      </li>
      {data.map((item, index) => (
        <li
          onClick={() => handleRowClick(item)}
          key={index}
          className="grid cursor-pointer grid-cols-5 text-nowrap text-lg p-2 hover:bg-[#e0c3d4]"
        >
          <p className="truncate" title={item.preparationName}>{item.preparationName}</p>
          <p className="truncate" title={item.positionName}>{item.positionName}</p>
          <p className="truncate" title={item.preoDiff}>{item.prepDiff}</p>
          <p className="truncate" title={item.sessionStartDate}>{item.sessionStartDate}</p>
          <p className="truncate" title={item.timeTaken}>{item.timeTaken}</p>
        </li>
      ))}
    </ul>
  );
};

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
  title: PropTypes.string.isRequired, // Add validation for title
};

export default InterviewLogTable;
