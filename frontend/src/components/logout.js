import React from "react";
import { useNavigate } from "react-router-dom";

export const Logout = () => {
    const navigate = useNavigate();
    window.localStorage.removeItem("isLoggedIn")
    const logoutHandler = () => {
        localStorage.removeItem('authToken');
    
        // Redirect to login page
        navigate('/');
    }
    return(
        <div>
            <button className = 'submit' onClick = {logoutHandler}>logout</button>
        </div>
    );
}