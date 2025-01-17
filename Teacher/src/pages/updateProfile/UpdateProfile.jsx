import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { TeacherContext } from "../../context/teacherAuthContext";
import "./UpdateProfile.css";
import { toast } from "react-toastify";
import Login from "../../components/Login/Login";

const UpdateProfile = () => {
  const { url, token, data, setShowLogin } = useContext(TeacherContext);
  const [formData, setFormData] = useState({
    name: "",
    teacherId: "",
    department: "",
    subject: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (token && data) {
      console.log("data:", data);
      setFormData({
        name: data.name,
        teacherId: data.teacherId,
        department: data.department,
        subject: data.subject,
        email: data.email,
        password: "",
      });
    } else {
      setFormData({
        name: "",
        teacherId: "",
        department: "",
        subject: "",
        email: "",
        password: "",
      });
    }
  }, [data, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token || !data) {
      setShowLogin(true);
      return;
    }
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.put(
        `${url}/api/teacher-update/${formData.teacherId}`,
        {
          name: formData.name,
          email: formData.email,
          department: formData.department,
          subject: formData.subject,
          ...(formData.password && { password: formData.password }),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Profile updated successfully!");
        setFormData((prev) => ({
          ...prev,
          password: "",
        }));
      } else {
        toast.error(
          response.data.message || "Update failed. Please try again."
        );
      }
    } catch (err) {
      toast.error("Error updating teacher profile:", err);
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!token || !data ? <Login onClose={() => setShowLogin(false)} /> : null}
      <div className="profile-update-container">
        <div className="update-profile-page">
          <h2 className="update-profile-title">Update Information</h2>
          {error && <div className="auth-error-message">{error}</div>}
          <form onSubmit={handleSubmit} className="update-profile-form">
            <div className="update-profile-group">
              <label htmlFor="name" className="update-profile-label">
                Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="update-profile-input"
              />
            </div>
            <div className="update-profile-group">
              <label htmlFor="teacherId" className="update-profile-label">
                Teacher ID:
              </label>
              <input
                type="text"
                id="teacherId"
                name="teacherId"
                value={formData.teacherId}
                disabled
                className="update-profile-input"
              />
            </div>
            <div className="update-profile-group">
              <label htmlFor="department" className="update-profile-label">
                Department:
              </label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="update-profile-input"
              />
            </div>
            <div className="update-profile-group">
              <label htmlFor="subject" className="update-profile-label">
                Subject:
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="update-profile-input"
              />
            </div>
            <div className="update-profile-group">
              <label htmlFor="email" className="update-profile-label">
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                disabled // Email should not be editable
                className="update-profile-input"
              />
            </div>
            <div className="update-profile-group">
              <label htmlFor="password" className="update-profile-label">
                Password:
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                className="update-profile-input"
              />
            </div>
            <button
              type="submit"
              className="update-profile-button"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdateProfile;
