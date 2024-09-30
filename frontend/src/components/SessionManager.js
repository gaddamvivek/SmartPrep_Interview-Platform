// src/components/SessionManager.js
import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';


const SessionManager = ({ inactivityDuration = 15 * 60 * 1000 }) => {
    const navigate = useNavigate();

    // Function to handle user activity (mouse movement or keypress)
    const handleActivity = useCallback(() => {
        localStorage.setItem('lastActivityTime', Date.now()); // Reset the last activity time
    }, []);

    // Check for inactivity
    useEffect(() => {
        const checkInactivity = () => {
            const lastActivityTime = parseInt(localStorage.getItem('lastActivityTime'), 10) || Date.now();
            if (Date.now() - lastActivityTime > inactivityDuration) {
                alert('You have been inactive for too long. Logging out...');
                localStorage.removeItem('isLoggedIn'); // Clear session
                navigate('/login'); // Redirect to login
            }
        };

        const activityInterval = setInterval(checkInactivity, 1000);

        return () => clearInterval(activityInterval); // Cleanup on unmount
    }, [inactivityDuration, navigate]);

    // Add event listeners for detecting user activity
    useEffect(() => {
        window.addEventListener('mousemove', handleActivity);
        window.addEventListener('keypress', handleActivity);

        return () => {
            window.removeEventListener('mousemove', handleActivity);
            window.removeEventListener('keypress', handleActivity);
        };
    }, [handleActivity]);

    return null; // This component doesn't render anything
};
SessionManager.propTypes = {
    inactivityDuration: PropTypes.number.isRequired, // Define that inactivityDuration is a required prop of type number
};

export default SessionManager;
