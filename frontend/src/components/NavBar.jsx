import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { Logout } from './logout';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo-nav.png';

export const NavBar = (props) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [email,setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  const handleProfileButton = () => {
    setIsProfileOpen((prevState) => !prevState);
  };

  const showNewInterview = props.showNewInterview || false;
  const showSignIn = props.showSignIn || false;
  const showProfile = props.showProfile || false;

  useEffect(() => {
    // Retrieve user info from localStorage
    const userEmail = localStorage.getItem('userEmail');
    const uName = localStorage.getItem('userName');

    setEmail(userEmail);
    setUserName(uName);
  }, []);  
  const handleSignIn = () => {
    if (localStorage.getItem('logindata')) navigate('/dashboard');
    else navigate('/login');
  };
  const handleNewInterview = () => {
    if (localStorage.getItem('logindata')) navigate('/interviewdetails');
    else navigate('/login');
  }

  const handleHome = () => {
    navigate('/dashboard');
  };

  return (
    <nav className=" relative grid grid-cols-3 justify-between font-rubik items-center p-2 shadow-white shadow-lg">
      <div
        onClick={handleHome}
        className="text-6xl cursor-pointer font-semibold font-mono"
      >
        <img src={logo} className="w-60" />
      </div>
      {showNewInterview && (
        <div className="flex justify-center">
          <div
            onClick={handleNewInterview}
            className="text-center font-semibold cursor-pointer text-lg bg-[#7360bf] p-2 rounded-lg text-[#ffffff] hover:bg-[#433878] w-fit"
          >
            New Interview
          </div>
        </div>
      )}
      {showSignIn && (
        <div className="flex justify-end">
          <div
            onClick={handleSignIn}
            className="text-center font-semibold cursor-pointer text-lg bg-green-600 p-2 rounded-lg w-fit text-[#ffffff] hover:bg-green-700"
          >
            Log In
          </div>
        </div>
      )}
      {showProfile && (
        <div className="flex font-semibold relative items-center justify-end gap-3">
          <div
            onClick={handleProfileButton}
            className="relative cursor-pointer"
          >
            Profile
          </div>
          {isProfileOpen && (
            <div className="p-3 min-w-44 bg-[#7360bf] text-white text-center absolute top-16 rounded-lg py-3 ">
              <div className="">
                {userName}
              </div>
              <div className="" id="profile-email">
                {email}
              </div>
              <hr />
              <Logout />
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

// Add PropTypes validation for props
NavBar.propTypes = {
  showNewInterview: PropTypes.bool,
  showSignIn: PropTypes.bool,
  showProfile: PropTypes.bool,
};
