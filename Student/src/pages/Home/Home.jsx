import React, { useContext } from "react";
import "./Home.css";

import { assets } from "../../assets/assets";
import { NavLink } from "react-router-dom";
import { StudentContext } from "../../context/studentContext";

const Home = () => {
  const { token, data } = useContext(StudentContext);

  const name = token && data ? data.name : "there";

  return (
    <div className="Container">
      <div className="UpperContainer">
        <p>Hi {name}, Hope you are doing well.</p>
      </div>
      <div className="LowerContainer">
        <div className="box">
          <div className="left-box">
            <div className="upper-left">
              <img src={assets.image} />
            </div>
            <div className="lower-left">
              <NavLink to="/SearchTeacher">
                <button>Search Teacher</button>
              </NavLink>
            </div>
          </div>
          <div className="right-box">
            <p>
              Find Your Guide, Book Your Time, Connect and Learn - All Online!
              <br />
              <br />
              Your path to clarity is just a click away: Search • Schedule •
              Message • Succeed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
