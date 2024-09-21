import React from 'react';
import './Navbar.css'; // Assuming you have a CSS file for styles
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate=useNavigate()
    let handleLogout = () => {
        axios.post("http://localhost:3000/logout",{},{withCredentials:true}).then((response)=>{
            console.log(response.data.message);
            navigate('/')
            
        })
      };

    return (
        <nav className="navbar">
            <div className="navbar-brand">My App</div>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
        </nav>
    );
};

export default Navbar;
