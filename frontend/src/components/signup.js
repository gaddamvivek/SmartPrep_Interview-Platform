import React, { useState } from 'react';
import './loginSignup.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

export const Signup = () => {
  const [fname, setFname] = useState('');
  const [fnameError, setFnameError] = useState('');
  const [lname, setLname] = useState('');
  const [lnameError, setLnameError] = useState('');
  const [email, setemail] = useState('');
  const [mailError, setMailError] = useState('');
  const [username, setusername] = useState('');
  const [usernameError, setusernameError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPassword,setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const onClickHandler = () => {
    console.log('Login button clicked');
    navigate('/login');
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    // Set initial error values to empty
    setMailError('');
    setPasswordError('');
    setLnameError('');
    setFnameError('');

    if ('' === fname) {
      setFnameError('Please enter first name');
      return;
    }
    if ('' === lname) {
      setLnameError('Please enter last name');
      return;
    }
    if ('' === username) {
      setusernameError('Please enter user name');
      return;
    }
    // Check if the user has entered both fields correctly
    if ('' === email) {
      setMailError('Please enter your email');
      return;
    }

    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setMailError('Please enter a valid email');
      return;
    }

    if ('' === password) {
      setPasswordError('Please enter a password');
      return;
    }

    if (password.length < 8) {
      setPasswordError('The password must be 8 characters or longer');
      return;
    }
    if(password != confirmPassword){
      alert('Password Mismatch, Please try Again!!!')
      return;
    }

    try {
      const result = await axios.post('https://icsi518-team1-prepsmart.onrender.com/api/auth/register', {
        fname,
        lname,
        username,
        email,
        password,
      });
      // 'http://localhost:5001/api/auth/register'
      
      if (result) alert('Registration Successful');
      navigate('/');
      // Reset form fields
      setFname('');
      setLname('');
      setusername('');
      setemail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      if (err.response && err.response.data) {
        console.error(err.response.data);
        setMailError(err.response.data); // Display server error message
      } else {
        console.error(err);
        setMailError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div>Sign Up</div>
      </div>
        <form onSubmit={onSubmitHandler}>
          <div className="nameContainer">
            <div className="userName">
              <input
                type="text"
                placeholder="First Name"
                value={fname}
                onChange={(e) => setFname(e.target.value)}
                required
              />
              <label className="errorLabel">{fnameError}</label>
              <input
                type="text"
                placeholder="Last Name"
                value={lname}
                onChange={(e) => setLname(e.target.value)}
                required
              />
              <label className="errorLabel">{lnameError}</label>
            </div>
          </div>
          <div className="inputContainer">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setusername(e.target.value)}
              required
            />
            <label className="errorLabel">{usernameError}</label>
          </div>
          <div className="inputContainer">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setemail(e.target.value)}
              required
            />
            <label className="errorLabel">{mailError}</label>
          </div>
          <div className="inputContainer">
            <input
              type={isPasswordVisible ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
            onClick={togglePasswordVisibility}
            className="icon-toggle"
          >
            <FontAwesomeIcon icon={isPasswordVisible ? faEyeSlash : faEye} />
          </span>
            <label className="errorLabel">{passwordError}</label>
          </div>
          <div className="inputContainer">
            <input
              type={isConfirmPasswordVisible ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span
              onClick={toggleConfirmPasswordVisibility}
              className="absolute -right-14 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
            >
              <FontAwesomeIcon icon={isConfirmPasswordVisible ? faEyeSlash : faEye} />
            </span>
            <label className="errorLabel">{passwordError}</label>
          </div>
          <div className="loginsignupbtns">
            <button className="submit" type="submit">
              {' '}
              Signup
            </button>
            <button className="submit" type="button" onClick={onClickHandler}>
              {' '}
              Login
            </button>
          </div>
        </form>
    </div>
  );
};
