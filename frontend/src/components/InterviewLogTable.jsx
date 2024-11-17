import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const InterviewLogTable = ({ data }) => {
  const navigate = useNavigate();

  return (
    <ul className="divide-y rounded-xl bg-[#d2bceb] p-2 m-auto divide-gray-300 shadow-gray-500 shadow-lg">
      <li className="grid grid-cols-5 text-xl font-bold p-2">
        <p className="">Name</p>
        <p className="">Date</p>
        <p className="">position</p>
        <p className="">Diffuculty</p>
        <p className="">Time Taken</p>
      </li>
      {data.map((item, index) => {
        return (
          <li
            onClick={() => {
              navigate(`/feedback`, {
                state: { userId: item.userEmail, prName: item.preparationName },
              });
            }}
            key={index}
            className="grid cursor-pointer grid-cols-5 text-nowrap text-lg p-2 hover:bg-[#e0c3d4]"
          >
            <p className="">{item.preparationName}</p>
            <p className="">{item.sessionStartDate}</p>
            <p className="">{item.positionName}</p>
            <p className="">{item.prepDiff}</p>
            <p className="">{item.timeTaken}</p>
          </li>
        );
      })}
    </ul>
  );
};

export default InterviewLogTable;
