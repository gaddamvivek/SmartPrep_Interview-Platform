import React from 'react';
import { LoginSignup } from './components/login';
import { Dashboard } from './components/dashboard';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import { Signup } from './components/signup';
import { Home } from './components/Home';
import GoogleSignInButton from './components/GoogleSignInButton';
import SessionManager from './components/SessionManager';
function App() {
  return (
    <div>
      <Router>
        <SessionManager timeoutDuration={30 * 60 * 1000} inactivityDuration={10 * 60 * 1000} /> {/* 30 min session timeout, 5 min inactivity */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/google-signin" element={<GoogleSignInButton />} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;


