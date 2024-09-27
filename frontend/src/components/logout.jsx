import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Logout = () => {
  const navigate = useNavigate();
  window.localStorage.removeItem('isLoggedIn');
  const logoutHandler = () => {
    localStorage.removeItem('authToken');

    // Redirect to login page
    navigate('/');
  };
  return (
    <div>
      <button
        className="bg-[#5b99c2] text-[#1f316f] p-2 rounded-xl font-semibold"
        onClick={logoutHandler}
      >
        Logout
      </button>
    </div>
  );
};
