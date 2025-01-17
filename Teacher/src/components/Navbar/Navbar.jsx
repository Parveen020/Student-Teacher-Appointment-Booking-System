import React, { useState, useContext } from "react";
import "./Navbar.css";
import { NavLink, useNavigate } from "react-router-dom";
import Login from "../Login/Login";
import { TeacherContext } from "../../context/teacherAuthContext";
import { toast } from "react-toastify";

const Navbar = () => {
  const { token, setToken, data, setShowLogin } = useContext(TeacherContext);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();

  const name = data ? data.name : "";
  console.log("data:", data);

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
    setShowLogin(true);
    toast.success("You are Logged Out.");
  };

  const getInitials = (name) => {
    if (!name) return "";
    const words = name.split(" ");
    if (words.length === 1) return words[0][0].toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  return (
    <div className="navbar">
      <div className="navbar-brand">Teacher Panel</div>
      <div className="navbar-links">
        <div className="links">
          <NavLink to="/" className="nav-link">
            Home
          </NavLink>
          <NavLink to="/viewAppointments" className="nav-link">
            Appointments
          </NavLink>
          <NavLink to="/updateProfile" className="nav-link">
            UpdateProfile
          </NavLink>
        </div>
        {!token ? (
          <button type="button" onClick={handleLogin} className="login-button">
            Login
          </button>
        ) : (
          <button type="button" onClick={handleLogout} className="user-button">
            {getInitials(name)}
          </button>
        )}
      </div>
      {showAuthModal && <Login onClose={() => setShowAuthModal(false)} />}
    </div>
  );
};

export default Navbar;
