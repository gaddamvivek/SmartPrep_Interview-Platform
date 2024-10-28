import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Logout = () => {
  const navigate = useNavigate();
  window.localStorage.removeItem('isLoggedIn');
  const logoutHandler = () => {

    if (location.pathname === '/codeeditor' || location.pathname === '/technicalinterview') {
      const confirmLogout = window.confirm("Are you sure you want to log out? Your session history will not be stored.");
      if (!confirmLogout) return;
    } else {
      const confirmLogout = window.confirm("Are you sure you want to log out?");
      if (!confirmLogout) return;
    }

    localStorage.removeItem('logindata');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');

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
