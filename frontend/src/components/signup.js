import React, { useState } from 'react';
import './loginSignup.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const Signup = () => {
    const [fname,setFname] = useState('')
    const [fnameError, setFnameError] = useState('')
    const [lname,setLname] = useState('')
    const [lnameError, setLnameError] = useState('')
    const [email, setemail] = useState('')
    const [mailError, setMailError] = useState('')
    const [username, setusername] = useState('')
    const [usernameError, setusernameError] = useState('')
    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const navigate = useNavigate();

    const onClickHandler = () => {
      console.log('Login button clicked');
      navigate('/');
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        // Set initial error values to empty
        setMailError('')
        setPasswordError('')
        setLnameError('')
        setFnameError('')
      
        if('' === fname) {
            setFnameError('Please enter first name')
            return
        }
        if('' === lname) {
            setLnameError('Please enter last name')
            return
        }
        if('' === username){
          setusernameError('Please enter user name')
          return
        }
        // Check if the user has entered both fields correctly
        if ('' === email) {
          setMailError('Please enter your email')
          return
        }
      
        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
          setMailError('Please enter a valid email')
          return
        }
      
        if ('' === password) {
          setPasswordError('Please enter a password')
          return
        }
      
        if (password.length < 7) {
          setPasswordError('The password must be 8 characters or longer')
          return
        }
      
        try {
          const result = await axios.post('http://localhost:5001/auth/register', { fname, lname, username, email, password });
          if(result)
            alert("Registration Successful")
            navigate('/');
          // Reset form fields
          setFname('');
          setLname('');
          setusername('');
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
    }
    
return (
    <div className="container">
      <div className="header">
        <div>Sign Up</div>
      <form onSubmit={onSubmitHandler}>
              <div className="nameContainer">
                <div className="userName">
                    <input 
                    type="text" 
                    placeholder="First Name" 
                    value = {fname}
                    onChange = {(e) => setFname(e.target.value)}
                    required 
                   />
                  <label className="errorLabel">{fnameError}</label>
                    <input 
                    type="text" 
                    placeholder="Last Name" 
                    value = {lname}
                    onChange = {(e) => setLname(e.target.value)}
                    required 
                   />
                   <label className="errorLabel">{lnameError}</label>
                </div>
              </div>
              <div className="inputContainer">
                    <input 
                    type="text" 
                    placeholder="Username" 
                    value = {username}
                    onChange = {(e) => setusername(e.target.value)}
                    required />
                    <label className="errorLabel">{usernameError}</label>
                </div>
                <div className="inputContainer">
                    <input 
                    type="email" 
                    placeholder="Email address" 
                    value = {email}
                    onChange = {(e) => setemail(e.target.value)}
                    required />
                    <label className="errorLabel">{mailError}</label>
                </div>
                <div className="inputContainer">
                    <input 
                    type="password" 
                    placeholder="Password" 
                    value = {password}
                    onChange={(e) => setPassword(e.target.value)}
                    required />
                    <label className="errorLabel">{passwordError}</label>
                </div>
                <div className='loginsignupbtns'>
                  <button className = "submit" type = "submit"> Signup</button>
                  <button className = "submit" type = "button" onClick={onClickHandler}> Login</button>
                </div>
      </form>
    </div>
  </div>
  );
};
