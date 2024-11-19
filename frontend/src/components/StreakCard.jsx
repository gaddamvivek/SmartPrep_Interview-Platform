import React from 'react';
import PropTypes from 'prop-types';
import FireIcon from '../assets/icons/fire.png';

const StreakCard = ({ data }) => {
  console.log(data.map((item) => item.title));

  const currentStreak = data.filter(
    (item) => item.title === 'Current Streak'
  )[0];
  const longestStreak = data.filter(
    (item) => item.title === 'Longest Streak'
  )[0];

  console.log('current streak', currentStreak);
  console.log('longest streak', longestStreak);

  if (!currentStreak || !longestStreak) {
    return <div>Loading...</div>;
  }

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

StreakCard.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
};

StreakCard.defaultProps = {
  data: [],
};

export default StreakCard;

