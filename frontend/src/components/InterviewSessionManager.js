// src/components/InterviewSessionManager.js
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const InterviewSessionManager = ({ sessionDuration = 30 * 60 * 1000 }) => {
    const [timeLeft, setTimeLeft] = useState(sessionDuration);
    const [isWarning, setIsWarning] = useState(false); // State to trigger warning
    const navigate = useNavigate();

    // Update the timer every second
    useEffect(() => {
        if (timeLeft <= 0) {
            alert('Your interview session has expired. Redirecting to feedback page...');
            navigate('/feedback'); // Redirect to the feedback page after 30 minutes
            return;
        }

        // Trigger warning at 5 minutes remaining
        if (timeLeft <= 5 * 60 * 1000 && !isWarning) {
            alert('Warning: Your interview session will end in 5 minutes!');
            setIsWarning(true); // Prevent alert from showing multiple times
        }

        const timer = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1000);
        }, 1000);

        return () => clearInterval(timer); // Clear interval on unmount
    }, [timeLeft, isWarning, navigate]);

    // Format time in MM:SS
    const formatTime = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className={`timer ${isWarning ? 'warning' : ''}`}>
            <h2>Time Left: {formatTime(timeLeft)}</h2>
        </div>
    );
};

export default InterviewSessionManager;
