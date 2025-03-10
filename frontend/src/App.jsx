import React from 'react';
import { LoginSignup } from './components/login';
import { InterviewDetails } from './components/interviewDetails';
import { Dashboard } from './components/dashboard';
import { OpenEditor } from './components/openEditor';
import InterviewContainer from './components/InterviewContainer';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import { Signup } from './components/signup';
import { Home } from './components/Home';
import GoogleSignInButton from './components/GoogleSignInButton';
import SessionManager from './components/SessionManager';
import PropTypes from 'prop-types';
import Feedback from './components/feedback';
import { ForgetPassword } from './components/forgetpassword';
import TechnicalInterviewFeedback from './components/TechnicalInterviewFeedback';
import CompanyPage from './components/CompanyPage';
import Profile from './components/profile';


function App() {
  return (
    <div>
      <Router>
        <SessionManager timeoutDuration={30 * 60 * 1000} inactivityDuration={10 * 60 * 1000} /> {/* 30 min session timeout, 5 min inactivity */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/dashboard" element={<ProtectedRoutes><Dashboard /></ProtectedRoutes>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgetpassword" element={<ForgetPassword />} />
          <Route path="/codeeditor" element={<CodingRoutes><OpenEditor /></CodingRoutes>} />
          <Route path="/technicalinterview" element={<ProtectedRoutes><InterviewContainer /></ProtectedRoutes>} />
          <Route path="/interviewdetails" element={<ProtectedRoutes><InterviewDetails /></ProtectedRoutes>} />
          <Route path="/google-signin" element={<GoogleSignInButton />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/technicalFeedback" element={<TechnicalInterviewFeedback />} />
          <Route path="/new-interview/company/:companyName" element={<CompanyPage />} />
          <Route path="/profile" element={<Profile/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

export function ProtectedRoutes({ children }) {
  const dataAvail = localStorage.getItem("logindata");
  if (dataAvail) {
    return children;
  } else {
    return <Navigate to="/" />;
  }
}

// Add PropTypes validation for ProtectedRoutes
ProtectedRoutes.propTypes = {
  children: PropTypes.node.isRequired, // Validate that children are provided
};

/* Code required for public routes please don't delete it */
export function PublicRoutes({ children }) {
  const dataAvail = localStorage.getItem("logindata");
  if (dataAvail) {
    return <Navigate to="/dashboard" />;
  } else {
    return children;
  }
}

// Add PropTypes validation for PublicRoutes
PublicRoutes.propTypes = {
  children: PropTypes.node.isRequired, // Validate that children are provided
};

export function CodingRoutes({ children }) {
  const dataAvail = localStorage.getItem("logindata");
  const codeActivity = localStorage.getItem("codingSessionActive")
  if (dataAvail && codeActivity === 'true') {
    return children;
  } else {
    return <Navigate to="/dashboard" />;
  }
}
CodingRoutes.propTypes = {
  children: PropTypes.node.isRequired, // Validate that children are provided
};