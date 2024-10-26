import React from 'react';

const UserStatCard = ({ data }) => {
  return (
    <div className="w-full rounded-md font-semibold text-center content-center">
      <div className="text-2xl font-semibold">{data.value}</div>
      <div className="flex gap-3 justify-center">{data.title}</div>
      <div className="text-xs font-normal">something</div>
    </div>
  );
};



export default UserStatCard;
