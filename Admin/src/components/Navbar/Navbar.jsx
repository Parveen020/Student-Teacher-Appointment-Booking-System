import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="navbar-brand">Admin Panel</div>
      <div className="navbar-links">
        <div className="links">
          <NavLink to="/add" className="nav-link">
            Add
          </NavLink>
          <NavLink to="/approve-student" className="nav-link">
            Approve
          </NavLink>
          <NavLink to="/teacher-list" className="nav-link">
            Teachers
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
