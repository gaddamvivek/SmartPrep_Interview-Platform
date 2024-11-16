import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { Logout } from './logout';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo-nav.png';

export const NavBar = (props) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Main dropdown
  const [openSubmenu, setOpenSubmenu] = useState(null); // Submenu state
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  const handleProfileButton = () => {
    setIsProfileOpen((prev) => !prev);
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen((prev) => !prev); // Toggle main dropdown
    setOpenSubmenu(null); // Close any open submenus
  };

  const handleSubmenuToggle = (menu) => {
    setOpenSubmenu((prev) => (prev === menu ? null : menu)); // Toggle submenu
  };

  const handleSubmenuOption = (menu, option) => {
    if (menu === 'ByCompany') {
      navigate(`/new-interview/company/${option}`);
    } else if (menu === 'ByRole') {
      navigate(`/new-interview/role/${option}`);
    }
    setIsDropdownOpen(false); // Close dropdown after navigation
    setOpenSubmenu(null); // Close submenu
  };

  const showNewInterview = props.showNewInterview || false;
  const showSignIn = props.showSignIn || false;
  const showProfile = props.showProfile || false;

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    const uName = localStorage.getItem('userName');
    setEmail(userEmail);
    setUserName(uName);
  }, []);

  const handleSignIn = () => {
    if (localStorage.getItem('logindata')) navigate('/dashboard');
    else navigate('/login');
  };

  const handleHome = () => {
    navigate('/dashboard');
  };

  // Static data for dropdown
  const companies = ['Amazon', 'Google'];
  const roles = ['Frontend Engineer', 'Backend Engineer', 'DevOps Engineer', 'Software Engineer'];

  return (
    <nav className="relative grid grid-cols-3 justify-between font-rubik items-center p-4 shadow-lg">
      {/* Logo Section */}
      <div
        onClick={handleHome}
        className="text-6xl cursor-pointer font-semibold font-mono"
      >
        <img src={logo} className="w-60" alt="Logo" />
      </div>

      {/* New Interview Dropdown */}
      {showNewInterview && (
        <div className="flex justify-center relative">
          <div
            onClick={handleDropdownToggle}
            className="text-center font-semibold cursor-pointer text-lg bg-purple-600 p-2 rounded-lg text-white hover:bg-purple-700 w-fit"
          >
            New Interview
          </div>
          {isDropdownOpen && (
            <div className="absolute top-12 bg-white border rounded-lg shadow-lg w-48 z-10">
              {/* By Company */}
              <div
                onClick={() => handleSubmenuToggle('ByCompany')}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100 relative"
              >
                By Company
                {openSubmenu === 'ByCompany' && (
                  <div className="absolute left-full top-0 bg-white border rounded-lg shadow-lg w-36 z-20">
                    {companies.map((company) => (
                      <div
                        key={company}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSubmenuOption('ByCompany', company)}
                      >
                        {company}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* By Role */}
              <div
                onClick={() => handleSubmenuToggle('ByRole')}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100 relative"
              >
                By Role
                {openSubmenu === 'ByRole' && (
                  <div className="absolute left-full top-0 bg-white border rounded-lg shadow-lg w-48 z-20">
                    {roles.map((role) => (
                      <div
                        key={role}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSubmenuOption('ByRole', role)}
                      >
                        {role}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sign-In Button */}
      {showSignIn && (
        <div className="flex justify-end">
          <div
            onClick={handleSignIn}
            className="text-center font-semibold cursor-pointer text-lg bg-green-600 p-2 rounded-lg w-fit text-white hover:bg-green-700"
          >
            Log In
          </div>
        </div>
      )}

      {/* Profile Section */}
      {showProfile && (
        <div className="flex font-semibold relative items-center justify-end gap-3">
          <div onClick={handleProfileButton} className="relative cursor-pointer">
            Profile
          </div>
          {isProfileOpen && (
            <div className="p-3 min-w-44 bg-purple-600 text-white text-center absolute top-16 rounded-lg py-3">
              <div>{userName}</div>
              <div id="profile-email">{email}</div>
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

export default NavBar;