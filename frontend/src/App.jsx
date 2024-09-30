import React from 'react';
import { LoginSignup } from './components/login';
import { InterviewDetails } from './components/interviewDetails';
import { Dashboard } from './components/dashboard';
import { OpenEditor } from './components/openEditor';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import { Signup } from './components/signup';
import { Home } from './components/Home';
function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/dashboard" element={<ProtectedRoutes><Dashboard /></ProtectedRoutes>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/codeeditor" element = {<ProtectedRoutes> <OpenEditor /> </ProtectedRoutes>}/>
          <Route path="/interviewdetails" element={<ProtectedRoutes> <InterviewDetails /> </ProtectedRoutes>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
export function ProtectedRoutes({children}) {
  const dataAvail = localStorage.getItem("logindata")
  if(dataAvail) {
    return children
  }
  else {
    return <Navigate to="/" />
  }
}
/*Code required for public routes
please don't delete it*/
/*export function PublicRoutes({children}) {
  const dataAvail = localStorage.getItem("logindata")
  if(dataAvail) {
    return <Navigate to="/dashboard"/>
  }
  else {
    return children
  }
}*/
