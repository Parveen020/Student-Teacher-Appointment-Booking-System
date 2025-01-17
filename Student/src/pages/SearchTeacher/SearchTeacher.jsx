import React, { useState, useEffect, useContext } from "react";
import "./SearchTeacher.css";
import PopUp from "../PopUp/PopUp";
import { assets } from "../../assets/assets";
import { StudentContext } from "../../context/studentContext";
import Login from "../../components/Login/Login";

const SearchTeacher = () => {
  const { token, data, url, showLogin, setShowLogin } =
    useContext(StudentContext); // Accessing email and url from context
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showBookPopUp, setShowBookPopUp] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [status, setStatus] = useState("");
  const [scheduledTimes, setScheduledTimes] = useState({});

  useEffect(() => {
    if (!token || !data) {
      setShowLogin(true);
    } else {
      fetchTeachers();
    }
  }, [token, data, url, setShowLogin]);

  const fetchTeachers = async () => {
    try {
      const response = await fetch(`${url}/api/get-all-teachers`);
      const data = await response.json();
      if (data.success && data.data) {
        setTeachers(data.data);
        setFilteredTeachers(data.data);

        const initialTimes = data.data.reduce((acc, teacher) => {
          acc[teacher.teacherId] = "Not Scheduled";
          return acc;
        }, {});
      }
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    const filtered = teachers.filter(
      (teacher) =>
        teacher.name.toLowerCase().includes(term.toLowerCase()) ||
        teacher.department.toLowerCase().includes(term.toLowerCase()) ||
        teacher.subject.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredTeachers(filtered);
  };

  const handleBookAppointmentClick = (teacher) => {
    setSelectedTeacher(teacher);
    setShowBookPopUp(true);
  };

  const updateScheduledTime = (teacherId, date, time) => {
    const formattedTime = `${date} ${time}`;
    setScheduledTimes((prev) => ({
      ...prev,
      [teacherId]: formattedTime,
    }));
    console.log(
      `Scheduled time updated for teacherId ${teacherId}: ${formattedTime}`
    );
  };

  return (
    <>
      {showLogin ? <Login onClose={() => setShowLogin(false)} /> : <></>};
      <div className="Container">
        <div className="list add flex-col">
          <div className="list-heading">
            <p>All Teacher List</p>
          </div>
          <div className="list-search">
            <form className="searchform" onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                className="SearchHeading"
                name="SHeading"
                placeholder="Search Teachers..."
                autoComplete="off"
                autoFocus
                value={searchTerm}
                onChange={handleSearch}
              />
              <button className="searchbutton">
                <img src={assets.loupe} alt="Search" />
              </button>
            </form>
          </div>
          <div className="list-table">
            <div className="list-table-format title">
              <strong>Name</strong>
              <strong>TeacherId</strong>
              <strong>Department</strong>
              <strong>Subject</strong>
              <strong>Email</strong>
              <strong>Book Appointment</strong>
            </div>
            {filteredTeachers.map((teacher) => (
              <div key={teacher.teacherId} className="list-table-format">
                <span>{teacher.name}</span>
                <span>{teacher.teacherId}</span>
                <span>{teacher.department}</span>
                <span>{teacher.subject}</span>
                <span>{teacher.email}</span>
                <button
                  className="appointment-button"
                  onClick={() => handleBookAppointmentClick(teacher)}
                >
                  Book
                </button>
              </div>
            ))}
          </div>
        </div>
        {showBookPopUp && (
          <PopUp
            teacher={selectedTeacher}
            onClose={() => setShowBookPopUp(false)}
            onSchedule={(date, time) =>
              updateScheduledTime(selectedTeacher.teacherId, date, time)
            }
          />
        )}
      </div>
    </>
  );
};

export default SearchTeacher;
