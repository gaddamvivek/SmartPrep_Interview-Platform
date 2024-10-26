import React, { useEffect, useState } from 'react';
import InterviewLogTable from './InterviewLogTable';

const InterviewLogs = ({ email }) => {
  const logTypes = ['Technical Questions', 'Coding'];

  return (
    <div className="w-full p-10">
      <h2 className="text-3xl text-center font-semibold p-3">
        Recent Interviews
      </h2>
      <div className="grid grid-cols-2">
        {logTypes.map((type) => (
          <div key={type} className="p-3">
            <h3 className="text-2xl text-center font-semibold">{type}</h3>
            <InterviewLogTable email={email} type={type} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterviewLogs;
