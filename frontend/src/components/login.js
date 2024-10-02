import React, { useState } from 'react';
import './loginSignup.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import GoogleSignInButton from './GoogleSignInButton'; // Import Google Sign-In Button component


export const LoginSignup = () => {
  const [email, setemail] = useState('');
  const [mailError, setMailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const navigate = useNavigate();
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    // Set initial error values to empty
    setMailError('');
    setPasswordError('');

    // Check if the user has entered both fields correctly
    if ('' === email) {
      alert('Please enter your email');
      return;
    }

    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      alert('Please enter a valid email');
      return;
    }

    if ('' === password) {
      alert('Please enter a password');
      return;
    }

    if (password.length < 7) {
      alert('The password must be 8 characters or longer');
      return;
    }
    try {
      const result = await axios.post('http://localhost:5001/auth/login', { email, password });
      console.log(result)
      if(result){
        window.localStorage.setItem("isLoggedIn", true);   
        localStorage.setItem("logindata",JSON.stringify(result.data.accessToken))
        navigate('/dashboard')     
      }
      // Reset form fields
      setemail('');
      setPassword('');
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

  const toggleToSignup = () => {
    // Clear form fields and errors before switching
    setemail('');
    setPassword('');
    setMailError('');
    setPasswordError('');
    navigate('/Signup');
  };

  return (
    <div className="container font-rubik">
      <div className="header font-rubik">
        <div className='font-rubik'>Login</div>
      </div>
      <form onSubmit={onSubmitHandler}>
        <div className="inputContainer font-rubik">
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
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label className="errorLabel">{passwordError}</label>
        </div>
        <div className="submitContainer">
          <div>
            <button className="submit" type="submit">
              Login
            </button>
          </div>
        </div>
        <div className="forget-password">
          Forget password? <span>Click Here!</span>
        </div>
        <p className="Registerhere" style={{ color: '#393f81' }}>
          Don&apos;t have an account?
          <span className="register-link" onClick={toggleToSignup}>
            Register here
          </span>
        </p>
        <div className="submitContainer">
          <GoogleSignInButton />
        </div>
      </form>
    </div>
  );
};

