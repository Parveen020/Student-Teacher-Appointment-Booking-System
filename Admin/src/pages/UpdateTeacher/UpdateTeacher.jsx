import React, { useState, useEffect } from "react";
import "./UpdateTeacher.css";
import axios from "axios";
import { toast } from "react-toastify";

const UpdateTeacher = ({ url, teacherData, onClose, onUpdate }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    teacherId: "",
    department: "",
    subject: "",
    email: "",
  });

  useEffect(() => {
    if (teacherData) {
      setFormData({
        ...teacherData,
        password: "", // Clear password field on load
      });
    }
  }, [teacherData]);

  const handleClose = () => {
    setIsClosing(true);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.name || !formData.department || !formData.subject) {
        toast.error("Please fill in all required fields!");
        setIsLoading(false);
        return;
      }

      const updateData = {
        name: formData.name,
        teacherId: formData.teacherId,
        department: formData.department,
        subject: formData.subject,
        email: formData.email,
      };

      const response = await axios.put(
        `${url}/api/update-teacher/${formData.teacherId}`,
        updateData
      );

      if (response.data.success) {
        toast.success(response.data.message);
        if (onUpdate) {
          onUpdate(response.data.data);
        }

        // Only close the popup after a successful update
        onClose();
      } else {
        toast.error(response.data.message || "Update failed");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while updating. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="popup-overlay">
      <div className={`popup-container ${isClosing ? "closing" : ""}`}>
        <button
          className="close-button"
          onClick={handleClose}
          disabled={isLoading}
        >
          &times;
        </button>
        <h2>Update Teacher Information</h2>
        <form onSubmit={handleSubmit} className="popup-form">
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="teacherId">Teacher ID:</label>
            <input
              type="text"
              id="teacherId"
              name="teacherId"
              value={formData.teacherId || ""}
              disabled
            />
          </div>
          <div className="form-group">
            <label htmlFor="department">Department:</label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department || ""}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="subject">Subject:</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject || ""}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email || ""}
              disabled
            />
          </div>
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateTeacher;
