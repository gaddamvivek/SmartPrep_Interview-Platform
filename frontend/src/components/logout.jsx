import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Logout = () => {
  const navigate = useNavigate();
  window.localStorage.removeItem('isLoggedIn');
  const logoutHandler = () => {
    localStorage.clear();

    // Redirect to login page
    navigate('/');
  };
  return (
    <div>
      <button
        className="bg-[#f16767] m-1 hover:bg-[#e63232] hover:text-white p-1 rounded-lg font-semibold"
        onClick={logoutHandler}
      >
        Logout
      </button>
    </div>
  );
};
