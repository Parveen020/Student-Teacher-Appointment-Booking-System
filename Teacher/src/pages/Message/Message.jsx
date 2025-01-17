import React, { useState } from "react";
import "./Message.css";

const Message = ({ onClose }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [formData, setFormData] = useState({
    message: "",
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    handleClose(); // Use handleClose to ensure animation plays before closing
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
