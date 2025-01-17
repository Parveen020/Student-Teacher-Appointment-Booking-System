import React, { useContext, useState, useEffect } from "react";
import "./Appointments.css";
import { StudentContext } from "../../context/studentContext";
import { toast } from "react-toastify";
import axios from "axios";

const Appointments = () => {
  const { url, email, data } = useContext(StudentContext);
  const [updatedAppointments, setUpdatedAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const response = await axios.post(
        `${url}/api/student/get-all-appointments`,
        {
          email: email,
        }
      );

      if (response.data?.success) {
        setUpdatedAppointments(response.data.appointments);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();

    const intervalId = setInterval(fetchAppointments, 30000);

    return () => clearInterval(intervalId);
  }, [data?._id, url]);

  useEffect(() => {
    if (data?.appointments) {
      setUpdatedAppointments(data.appointments);
    }
  }, [data?.appointments]);

  const handleDelete = async (appointmentId) => {
    try {
      const response = await axios.delete(
        `${url}/api/student/delete-appointment`,
        {
          data: { appointmentId },
        }
      );

      if (response.status === 200) {
        setUpdatedAppointments(
          updatedAppointments.filter((app) => app._id !== appointmentId)
        );
        toast.success("Appointment Deleted SuccessFully.");
      } else {
        console.error("Error deleting appointment:", response.data.message);
        toast.success("Appointment Not Deleted.");
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };

  if (loading) {
    return <div className="appointment-container">Loading appointments...</div>;
  }

  return (
    <div className="appointment-container">
      <div className="appointment-window">
        <div className="appointment-header">
          <h3>Appointments</h3>
          <button
            className="refresh-button"
            onClick={fetchAppointments}
            title="Refresh appointments"
          >
            Refresh
          </button>
        </div>
        <div className="appointment-body">
          {updatedAppointments.length === 0 ? (
            <div className="no-appointments">No appointments found</div>
          ) : (
            updatedAppointments
              .filter((appointment) => Object.keys(appointment).length > 2)
              .map((appointment) => (
                <div key={appointment._id} className="appointment-card">
                  <div className="appointment-message">
                    <p>{appointment.message}</p>
                  </div>
                  <div className="appointment-upper-card">
                    <div className="appointment-details">
                      <h4>{appointment.teacherName}</h4>
                      <p>
                        <strong>Teacher ID:</strong> {appointment.teacherId}
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
                    <div className="button-group appointment-lower-card">
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(appointment._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Appointments;
