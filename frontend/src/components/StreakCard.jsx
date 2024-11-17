import React, { useState } from 'react';
import FireIcon from '../assets/icons/fire.png';
const StreakCard = ({ data }) => {
  /**
     * data = [
    {
        "title": "Longest Streak",
        "value": 13
    },
    {
        "title": "Current Streak",
        "value": 2
    }
]
     * 
     */
  console.log(data.map((item) => item.title));
  const currentStreak = data.filter(
    (item) => item.title === 'Current Streak'
  )[0];
  const longestStreak = data.filter(
    (item) => item.title === 'Longest Streak'
  )[0];
  console.log('current streak', currentStreak);
  console.log('longest streak', longestStreak);
  //   console.log('streak data', data);
  return (
    <div className="w-full rounded-md font-semibold text-center content-center">
      <div className="">
        <div className="flex justify-center text-2xl font-semibold">
          <img src={FireIcon} alt="" className="w-10 h-10" />
          <span className="text-4xl">{currentStreak.value}</span>
        </div>
        <div className="flex gap-3 justify-center">{`Current Streak`}</div>
        <div className="text-xs font-normal">{`Longest streak was ${longestStreak.value}`}</div>
      </div>
    </div>
  );
};

export default StreakCard;
