import React, { useState } from "react";
import "./ViewAppointments.css";

const ViewAppointments = ({ appointments, onUpdate }) => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedAppointment) {
      const updatedAppointments = appointments.map((appointment) =>
        appointment.id === selectedAppointment.id
          ? { ...appointment, date: formData.date, time: formData.time }
          : appointment
      );
      onUpdate(updatedAppointments);
      setSelectedAppointment(null);
      setFormData({ date: "", time: "" });
    }
  };

  const handleFixClick = (appointment) => {
    setSelectedAppointment(appointment);
    setFormData({ date: appointment.date, time: appointment.time });
  };

  return (
    <div className="appointments-container">
      <h2>View Appointments</h2>
      <div className="appointments-list">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="appointment-card">
            <div className="appointment-details">
              <span className="sender-name">{appointment.senderName}</span>
              <div className="appointment-time">
                <span className="appointment-date">{appointment.date}</span>
                <span className="appointment-time">{appointment.time}</span>
              </div>
            </div>
            <button
              className="fix-button"
              onClick={() => handleFixClick(appointment)}
            >
              Fix
            </button>
          </div>
        ))}
      </div>

      {selectedAppointment && (
        <div className="popup-overlay">
          <div className="popup-container">
            <button
              className="close-button"
              onClick={() => setSelectedAppointment(null)}
            >
              ×
            </button>
            <h3>Reschedule Appointment</h3>
            <form className="popup-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Date:</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Time:</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="submit-button">
                Update Time
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAppointments;
