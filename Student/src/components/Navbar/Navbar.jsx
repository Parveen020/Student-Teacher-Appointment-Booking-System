import React, { useState, useContext, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import Login from "../Login/Login";
import { StudentContext } from "../../context/studentContext";
import { toast } from "react-toastify";

const Navbar = () => {
  const { token, setToken, data } = useContext(StudentContext);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();

  const name = data.name;
  console.log("name:", name);

  const handleLogin = () => {
    setShowAuthModal(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("data");
    localStorage.removeItem("isLoggedIn");
    setToken("");
    navigate("/");
    toast.success("You are Logged out!!!");
  };

  const getInitials = (name) => {
    if (!name) return "";
    const words = name.split(" ");
    if (words.length === 1) return words[0][0].toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  return (
    <div className="navbar">
      <div className="navbar-brand">Student Panel</div>
      <div className="navbar-links">
        <div className="links">
          <NavLink to="/" className="nav-link">
            Home
          </NavLink>
          <NavLink to="/searchTeacher" className="nav-link">
            SearchTeacher
          </NavLink>
          <NavLink to="/view-all-appointments" className="nav-link">
            ViewAppointments
          </NavLink>
        </div>
        {!token ? (
          <button
            type="button"
            onClick={handleLogin}
            className="login-button"
            title="Login to your account"
          >
            Login
          </button>
        ) : (
          <button
            type="button"
            onClick={handleLogout}
            className="user-button"
            title="LogoOut"
          >
            {getInitials(name)}
          </button>
        )}
      </div>
      {showAuthModal && <Login onClose={() => setShowAuthModal(false)} />}
    </div>
  );
};

export default Navbar;
