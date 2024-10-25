import React, { useState, useEffect } from 'react';
 

const Timer = ({ interviewTime, setTestRun,testRun }) => {
  const [time, setTime] = useState(() => {
    const timeSaved = localStorage.getItem('remainingTime');
    if (timeSaved !== null && !isNaN(parseInt(timeSaved, 10))) {
      return parseInt(timeSaved, 10);
    } else {
      return interviewTime;
    }
  });

  const [endTest, setEndTest] = useState(false);

  useEffect(() => {
    localStorage.setItem('remainingTime', time);

    if (time === 0) {
        setTestRun(false);
      setEndTest(true);
      return;
    }

    if (testRun && time > 0) {
      const timerId = setInterval(() => {
        setTime((remTime) => remTime - 1);
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [time, testRun,setTestRun]);

  const timeFormat = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      {endTest ? (<h2>Test Ended</h2>) : 
      (
        <h2>Time Remaining: {timeFormat(time)}</h2>
      )}
    </div>
  );
};

export default Timer;
