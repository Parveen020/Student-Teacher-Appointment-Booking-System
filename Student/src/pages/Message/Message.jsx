import React, { useState, useContext } from "react";
import "./Message.css";
import { StudentContext } from "../../context/studentContext";
import axios from "axios";

const Message = ({ teacher, onClose }) => {
  const { url, email } = useContext(StudentContext); // Access URL and student email from context
  const [isClosing, setIsClosing] = useState(false);
  const [formData, setFormData] = useState({
    message: "",
  });

  console.log("StudentEmail:", email);

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
      const response = await axios.post(`${url}/api/student/send-message`, {
        studentEmail: email,
        teacherEmail: teacher.email,
        message: formData.message,
      });

      if (response.data.success) {
        alert("Message sent successfully!");
      } else {
        alert("Error sending message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Error sending message");
    }

    handleClose();
  };

  return (
    <div className="popup-overlay">
      <div className={`popup-container ${isClosing ? "closing" : ""}`}>
        <button className="close-button" onClick={handleClose}>
          &times;
        </button>
        <h2>Write Message</h2>
        <form onSubmit={handleSubmit} className="popup-form">
          <div className="form-group">
            <textarea
              type="text"
              id="message"
              rows="8"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="Write Message"
            />
          </div>
          <button type="submit" className="submit-button">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Message;
