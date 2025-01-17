import React, { useState, useContext } from "react";
import "./PopUp.css";
import { StudentContext } from "../../context/studentContext";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PopUp = ({ teacher, onClose }) => {
  const { email, url } = useContext(StudentContext);
  const [isClosing, setIsClosing] = useState(false);
  const [formData, setFormData] = useState({
    message: "",
    date: "",
    time: "",
  });

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 600); // Match this with animation duration
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Prepare data
      const { message, date, time } = formData;
      const formattedTime = `${time}:00`; // Add seconds to time format

      const response = await axios.post(`${url}/api/student/book-appointment`, {
        studentEmail: email,
        teacherEmail: teacher.email,
        date,
        time: formattedTime,
        message: message,
      });

      if (response.data.success) {
        toast.success("Appointment booked successfully!");
      } else {
        toast.error(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast.error("Failed to book appointment. Please try again.");
    }

    handleClose(); // Close the pop-up after submitting
  };

  return (
    <div className="popup-overlay">
      <div className={`popup-container ${isClosing ? "closing" : ""}`}>
        <button className="close-button" onClick={handleClose}>
          &times;
        </button>
        <h2>Book Appointment</h2>
        <form onSubmit={handleSubmit} className="popup-form">
          <div className="form-group">
            <label htmlFor="message">Message:</label>
            <textarea
              type="text"
              id="message"
              rows="3"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="Write Message"
            />
          </div>
          <div className="form-group">
            <label htmlFor="date">Date:</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="time">Time:</label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default PopUp;
