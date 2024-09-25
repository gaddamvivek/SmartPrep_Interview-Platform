import React, { useState } from 'react';
import { LoginSignup } from './components/login';
import { Dashboard } from './components/dashboard';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css';
import { Signup } from './components/signup';

function App() {

  return (
    <div>
    <Router>
      <Routes>
        <Route path="/" element={<LoginSignup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
    </div>
    
  );
}

export default App;