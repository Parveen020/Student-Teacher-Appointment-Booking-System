import React, { useState, useEffect } from "react";
import "./TeacherList.css";
import axios from "axios";
import { toast } from "react-toastify";
import UpdateTeacher from "../UpdateTeacher/UpdateTeacher";
import { assets } from "../../assets/assets";

const TeacherList = ({ url }) => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTeacher, setCurrentTeacher] = useState({});
  const [showUpdatePopUp, setShowUpdatePopUp] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${url}/api/get-all-teachers`);
      const result = await response.json();

      if (result.success) {
        setTeachers(result.data);
      } else {
        setError("Failed to fetch teachers");
      }
    } catch (err) {
      setError("Error connecting to server");
      console.error("Error fetching teachers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, [url]);

  const handleUpdatePopUp = (teacher) => {
    setCurrentTeacher(teacher);
    setShowUpdatePopUp(true);
  };

  const handleClosePopUp = () => {
    setShowUpdatePopUp(false);
    setCurrentTeacher({});
    fetchTeachers();
  };

  const handleDeleteTeacher = async (teacherId) => {
    try {
      const response = await axios.delete(
        `${url}/api/delete-teacher/${teacherId}`
      );

      if (response.data.success) {
        toast.success(response.data.message);
        fetchTeachers();
      } else {
        toast.error(response.data.message || "Delete failed");
      }
    } catch (err) {
      console.error("Error deleting teacher:", err);
    }
  };

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading)
    return <div className="teacher-loading">Loading teachers...</div>;
  if (error) return <div className="teacher-error">{error}</div>;

  return (
    <div className="teacher-container">
      <div className="teacher-content flex-col">
        <div className="teacher-heading">
          <p>All Teacher List</p>
        </div>
        <div className="teacher-search-wrapper">
          <form className="teacher-search-form">
            <input
              type="text"
              className="teacher-search-input"
              name="SHeading"
              placeholder="Search Teachers..."
              autoComplete="off"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="teacher-search-btn" type="submit">
              <img src={assets.loupe} alt="Search" />
            </button>
          </form>
        </div>
        <div className="teacher-table-container">
          <div className="teacher-table-row header">
            <strong>Name</strong>
            <strong>Teacher Id</strong>
            <strong>Department</strong>
            <strong>Subject</strong>
            <strong>Email</strong>
            <strong>Update</strong>
            <strong>Delete</strong>
          </div>
          {filteredTeachers.length > 0 ? (
            filteredTeachers.map((teacher) => (
              <div key={teacher.teacherId} className="teacher-table-row">
                <span>{teacher.name}</span>
                <span>{teacher.teacherId}</span>
                <span>{teacher.department}</span>
                <span>{teacher.subject}</span>
                <span>{teacher.email}</span>
                <button
                  className="teacher-update-btn"
                  onClick={() => handleUpdatePopUp(teacher)}
                >
                  Update
                </button>
                <button
                  className="teacher-delete-btn"
                  onClick={() => handleDeleteTeacher(teacher.teacherId)}
                >
                  <img src={assets.deleteIcon} />
                </button>
              </div>
            ))
          ) : (
            <div className="teacher-table-row">
              <span colSpan="7" className="teacher-no-data">
                No teachers found
              </span>
            </div>
          )}
        </div>
      </div>
      {showUpdatePopUp && (
        <UpdateTeacher
          url={url}
          teacherData={currentTeacher}
          onClose={handleClosePopUp}
          onUpdate={(updatedData) => {
            fetchTeachers();
          }}
        />
      )}
    </div>
  );
};

export default TeacherList;
