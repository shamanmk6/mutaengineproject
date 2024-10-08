import React from "react";
import "./Navbar.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  let handleLogout = () => {
    axios
      .post("https://goshopper.shop/logout", {}, { withCredentials: true })
      .then((response) => {
        navigate("/");
      });
  };
  return (
    <nav className="navbar">
      <div className="navbar-brand">My App</div>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
};
export default Navbar;
