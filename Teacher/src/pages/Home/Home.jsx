import React, { useContext } from "react";
import "./Home.css";
import { NavLink } from "react-router-dom";
import { assets } from "../../assets/assets";
import { TeacherContext } from "../../context/teacherAuthContext";

const Home = () => {
  const { token, data } = useContext(TeacherContext);
  const name = token && data ? data.name : "there";
  return (
    <div className="Container">
      <div className="UpperContainer">
        <p>Hi {name},</p>
      </div>
      <div className="LowerContainer">
        <div className="box">
          <div className="left-box">
            <div className="upper-left">
              <img src={assets.image} />
            </div>
            <div className="lower-left">
              <NavLink to="/viewAppointments">
                <button>View Appointments</button>
              </NavLink>
            </div>
          </div>
          <div className="right-box">
            <p>
              Building Bridges Beyond the Bell: Your Questions Matter, Anytime,
              Anywhere
              <br />
              <br />
              View student message, fix appointment with them to solve their
              problems.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
