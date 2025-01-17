import React, { useState, useEffect } from "react";
import "./ApproveStudent.css";
import axios from "axios";
import { toast } from "react-toastify";

const ApproveStudent = ({ url }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/api/get-all-students`);
      if (response.data.success) {
        console.log("Initial student data:", response.data.data);
        setStudents(response.data.data);
      } else {
        setError("Failed to fetch students");
      }
    } catch (err) {
      setError("Error connecting to server");
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [url]);

  const handleStatusChange = async (studentRollNo, newStatus) => {
    try {
      setLoading(true);

      const isApproved =
        newStatus === "approved"
          ? true
          : newStatus === "rejected"
          ? false
          : null;

      const response = await axios.put(`${url}/api/approve-student`, {
        studentRollNo,
        isApproved,
        status: newStatus,
      });

      if (response.data.success) {
        toast.success(`Student status updated to ${newStatus}!`);
        setStudents(
          students.map((student) =>
            student.rollNo === studentRollNo
              ? { ...student, isApproved, status: newStatus }
              : student
          )
        );
      } else {
        toast.error(
          response.data.message || "Failed to update student status."
        );
      }
    } catch (error) {
      console.error("Error updating student status:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while updating. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.sort((a, b) => {
    return a.isApproved === b.isApproved ? 0 : a.isApproved ? 1 : -1;
  });

  if (loading)
    return <div className="student-loading">Loading students...</div>;
  if (error) return <div className="student-error">{error}</div>;

  return (
    <div className="student-container">
      <div className="student-section">
        <div className="student-header">
          <p>Student Approval List</p>
        </div>
        <div className="student-table-container">
          <div className="student-row student-row-header">
            <strong>Name</strong>
            <strong>ID</strong>
            <strong>Email</strong>
            <strong>Status</strong>
          </div>
          {filteredStudents.map((student) => (
            <div key={student.rollNo} className="student-row">
              <span>{student.name}</span>
              <span>{student.rollNo}</span>
              <span>{student.email}</span>
              <select
                className="student-status-select"
                value={
                  student.status === "true" ||
                  (student.isApproved === true
                    ? "approved"
                    : student.isApproved === false
                    ? "rejected"
                    : "pending")
                }
                onChange={(e) =>
                  handleStatusChange(student.rollNo, e.target.value)
                }
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApproveStudent;
