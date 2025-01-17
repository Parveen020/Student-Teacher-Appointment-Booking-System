import React, { useContext, useState, useEffect } from "react";
import "./ViewAppointments.css";
import { TeacherContext } from "../../context/teacherAuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import Login from "../../components/Login/Login";

const ViewAppointments = () => {
  const { url, token, data, setShowLogin } = useContext(TeacherContext);
  const [updatedAppointments, setUpdatedAppointments] = useState([]);
  const teacherId = data?.teacherId;

  // Clear appointments when token or data is not present (logout)
  useEffect(() => {
    if (!token || !data) {
      setUpdatedAppointments([]);
    } else if (data?.appointments) {
      setUpdatedAppointments(data.appointments);
    }
  }, [token, data]);

  const fetchAppointments = async () => {
    if (!token || !data) {
      setShowLogin(true);
      return;
    }

    try {
      const response = await axios.post(
        `${url}/api/teacher/get-all-appointments`,
        {
          email: data.email,
        }
      );
      if (response.status === 200) {
        setUpdatedAppointments(response.data.appointments);
      } else {
        console.error("Error fetching appointments:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      // Clear appointments on error as well
      setUpdatedAppointments([]);
    }
  };

  const handleUpdate = async (appointmentId, newDate, newTime) => {
    if (!token || !data) {
      setShowLogin(true);
      return;
    }

    try {
      const response = await axios.put(
        `${url}/api/teacher/update-appointment`,
        {
          appointmentId,
          teacherId,
          updatedDate: newDate,
          updatedTime: newTime,
          status: "approved",
        }
      );

      if (response.status === 200) {
        setUpdatedAppointments(response.data.appointments);
        toast.success("Appointment Scheduled.");
      } else {
        toast.error("Error updating appointment:", response.data.message);
      }
    } catch (error) {
      toast.error("Error updating appointment:", error);
    }
  };

  const handleReject = async (appointmentId) => {
    if (!token || !data) {
      setShowLogin(true);
      return;
    }

    try {
      const response = await axios.put(
        `${url}/api/teacher/update-appointment`,
        {
          appointmentId,
          teacherId,
          status: "rejected",
        }
      );

      if (response.status === 200) {
        setUpdatedAppointments(response.data.appointments);
        toast.success("Appointment Rejected.");
      } else {
        toast.error("Error rejecting appointment:", response.data.message);
      }
    } catch (error) {
      toast.error("Error rejecting appointment:", error);
    }
  };

  const handleDelete = async (appointmentId) => {
    if (!token || !data) {
      setShowLogin(true);
      return;
    }

    try {
      const response = await axios.delete(
        `${url}/api/teacher/delete-appointment`,
        {
          data: { appointmentId, teacherId },
        }
      );

      if (response.status === 200) {
        setUpdatedAppointments(
          updatedAppointments.filter((app) => app._id !== appointmentId)
        );
        toast.success("Appointment deleted Successfully.");
      } else {
        toast.error("Error deleting appointment:", response.data.message);
      }
    } catch (error) {
      toast.error("Error deleting appointment:", error);
    }
  };

  return (
    <>
      {!token || !data ? <Login onClose={() => setShowLogin(false)} /> : null}
      <div className="appointment-container">
        <div className="appointment-window">
          <div className="appointment-header">
            <h3>Appointments</h3>
            <span className="appointment-count">
              {updatedAppointments.length}{" "}
              {updatedAppointments.length === 1
                ? "appointment"
                : "appointments"}
            </span>
            <button
              className="refresh-button"
              onClick={fetchAppointments}
              disabled={!token || !data}
            >
              Refresh
            </button>
          </div>
          <div className="appointment-body">
            {token &&
              data &&
              updatedAppointments.map((appointment) => (
                <div key={appointment._id} className="appointment-card">
                  <div className="appointment-message">
                    <p>{appointment.message}</p>
                  </div>
                  <div className="appointment-upper-card">
                    <div className="appointment-details">
                      <h4>{appointment.studentName}</h4>
                      <p>
                        <strong>Roll No:</strong> {appointment.studentRollNo}
                      </p>
                      <p>
                        <strong>Date:</strong> {appointment.date}
                      </p>
                      <p>
                        <strong>Time:</strong> {appointment.time}
                      </p>
                      <p>
                        <strong>Status:</strong>{" "}
                        <span className={`status-${appointment.status}`}>
                          {appointment.status}
                        </span>
                      </p>
                    </div>
                    <div className="reschedule-block">
                      <div className="date-time-input">
                        <label htmlFor={`fixedDate-${appointment._id}`}>
                          Fixed Date
                        </label>
                        <input
                          type="date"
                          id={`fixedDate-${appointment._id}`}
                          defaultValue={appointment.date}
                        />
                      </div>
                      <div className="date-time-input">
                        <label htmlFor={`fixedTime-${appointment._id}`}>
                          Fixed Time
                        </label>
                        <input
                          type="time"
                          id={`fixedTime-${appointment._id}`}
                          defaultValue={appointment.time}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="button-group appointment-lower-card">
                    <button
                      className="fix-button"
                      onClick={() =>
                        handleUpdate(
                          appointment._id,
                          document.getElementById(
                            `fixedDate-${appointment._id}`
                          ).value,
                          document.getElementById(
                            `fixedTime-${appointment._id}`
                          ).value
                        )
                      }
                      disabled={
                        appointment.status === "approved" ||
                        appointment.status === "rejected"
                      }
                    >
                      Schedule
                    </button>
                    <button
                      className="reject-button"
                      onClick={() => handleReject(appointment._id)}
                      disabled={
                        appointment.status === "approved" ||
                        appointment.status === "rejected"
                      }
                    >
                      Reject
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(appointment._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewAppointments;
