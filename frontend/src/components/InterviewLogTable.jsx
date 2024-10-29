import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const InterviewLogTable = ({ data }) => {
  const navigate = useNavigate();

  return (
    <ul className="divide-y rounded-xl bg-[#d2bceb] p-2 m-auto divide-gray-300 shadow-gray-500 shadow-lg">
      <li className="grid grid-cols-2 text-xl font-bold p-2">
        <p className="">Prep Name</p>
        <p className="">Date</p>
        {/* <p className="">Level</p> */}
      </li>
      {data.map((item, index) => {
        console.log(item);
        return (
          <li
            onClick={() => {
              navigate(`/feedback?interview=${item._id}`);
            }}
            key={index}
            className="grid cursor-pointer grid-cols-2 text-nowrap text-lg p-2"
          >
            <p className="">{item.preparationName}</p>
            <p className="">
              {/* {new Date(item.sessionStartDate).toLocaleDateString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric',
              })} */}
              {item.sessionStartDate}
            </p>
            {/* <p className="">{item.diffLvl}</p> */}
          </li>
        );
      })}
    </ul>
  );
};

export default InterviewLogTable;
