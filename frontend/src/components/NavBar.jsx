import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Logout } from './logout';
import { useNavigate } from 'react-router-dom';

export const NavBar = (props) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const handleProfileButton = () => {
    setIsProfileOpen((prevState) => !prevState);
  };

  const showNewInterview = props.showNewInterview || false;
  const showSignIn = props.showSignIn || false;
  const showProfile = props.showProfile || false;

  const handleSignIn = () => {
    if(localStorage.getItem("logindata"))
        navigate('/interviewdetails');
    else
        navigate('/login');

  };

  const handleHome = () => {
    navigate('/dashboard');
  };

  return (
    <nav className="bg-[#7E60BF] flex justify-between items-center p-2">
      <div onClick={handleHome} className="text-6xl cursor-pointer font-semibold font-mono">
        PrepSmart
      </div>
      {showNewInterview && (
        <div
          onClick={handleSignIn}
          className="font-semibold cursor-pointer text-lg bg-[#433878] p-2 rounded-lg text-[#f9dbba] hover:text-white"
        >
          New Interview
        </div>
      )}
      {showSignIn && (
        <div
          onClick={handleSignIn}
          className="font-semibold cursor-pointer text-lg bg-red-400 p-2 rounded-lg text-[#f9dbba] hover:text-white"
        >
          Log In
        </div>
      )}
      {showProfile && (
        <div className="flex font-semibold items-center justify-around gap-3">
          <div onClick={handleProfileButton} className="cursor-pointer">
            Profile
          </div>
          {isProfileOpen && (
            <div className="p-3 bg-[#5B99C2] text-center absolute top-20 right-4 rounded-lg py-3 text-[#1F316F]">
              <div className="">Username</div>
              <div className="" id="profile-email">
                Email
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
