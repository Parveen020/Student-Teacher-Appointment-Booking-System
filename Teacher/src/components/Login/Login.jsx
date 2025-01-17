import React, { useState, useContext } from "react";
import { TeacherContext } from "../../context/teacherAuthContext";
import axios from "axios";
import "./Login.css";

const Login = ({ onClose }) => {
  const { url, setToken, setEmail, setData, fetchTeacherData } =
    useContext(TeacherContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstLogin: false,
    agreeToTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.agreeToTerms) {
      setError("You must agree to the terms and conditions.");
      setLoading(false);
      return;
    }

    try {
      const loginData = {
        email: formData.email,
        ...(formData.firstLogin
          ? { firstLogin: true }
          : { password: formData.password }),
      };

      const response = await axios.post(`${url}/api/teacher-login`, loginData);

      if (response.data.success) {
        await fetchTeacherData(formData.email);

        setToken(response.data.token);
        setEmail(formData.email);

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("email", formData.email);

        onClose();
      } else {
        setLoading(true);
        setError(response.data.message);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message ||
          (formData.firstLogin
            ? "First-time login failed"
            : "Invalid email or password")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal">
        <h2 className="auth-title">Login</h2>

        {error && <div className="auth-error-message">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Your email"
            value={formData.email}
            onChange={handleInputChange}
            className="auth-input"
            required
          />

          {!formData.firstLogin && (
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="auth-input"
              required={!formData.firstLogin}
            />
          )}

          <div className="auth-checkbox-container">
            <input
              type="checkbox"
              name="firstLogin"
              checked={formData.firstLogin}
              onChange={handleInputChange}
              className="auth-checkbox"
            />
            <label className="auth-checkbox-label">First time login</label>
          </div>

          <div className="auth-checkbox-container">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              className="auth-checkbox"
              required
            />
            <label className="auth-checkbox-label">
              I agree to the terms of use & privacy policy
            </label>
          </div>

          <button
            type="submit"
            className="auth-submit-button"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
