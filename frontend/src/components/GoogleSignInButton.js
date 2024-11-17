// src/components/GoogleSignInButton.js
import React from 'react';
import { auth, googleProvider, signInWithPopup } from '../firebase'; // Ensure firebase is set up correctly
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import googleIcon from '../assets/google-icon.svg';

const GoogleSignInButton = () => {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      // Trigger Google Sign-In popup
      const result = await signInWithPopup(auth, googleProvider);

      console.log(result.email);
      console.log(result.user.email);


      // Get the Google ID token from the user
      const token = await result.user.getIdToken();

      // Send the token to the backend
      const response = await axios.post('http://localhost:5001/api/auth/google', { token });

      if (response.status === 200) {
        console.log(response.data);
        console.log('Google Sign-In successful, redirecting...');

        window.localStorage.setItem('logindata', response.data['uid']);
        window.localStorage.setItem('isLoggedIn', true);
        window.localStorage.setItem('userName', result.user.displayName);
        window.localStorage.setItem('userEmail', result.user.email);
        navigate('/dashboard'); // Redirect to dashboard
      } else {
        console.error('Login failed: ', response);
        alert('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during Google Sign-In:', error);
      alert('An error occurred during Google Sign-In. Please try again.');
    }
  };

  return (
    <div className="submitContainer">
      <button className="google-signin" onClick={handleGoogleSignIn}>
        <img className="google-icon" src={googleIcon} alt="Google Icon" />
        Continue with Google
      </button>
    </div>
  );
};

export default GoogleSignInButton;
