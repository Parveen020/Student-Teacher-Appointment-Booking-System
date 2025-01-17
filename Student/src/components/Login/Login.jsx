import React, { useContext, useState } from "react";
import "./Login.css";
import { StudentContext } from "../../context/studentContext";
import axios from "axios";

const AuthModal = ({ onClose }) => {
  const { url, setToken, setEmail, data, fetchStudentData } =
    useContext(StudentContext);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
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

    if (!formData.agreeToTerms && !isLogin) {
      setError("You must agree to the terms and conditions.");
      setLoading(false);
      return;
    }

    try {
      const endpoint = isLogin
        ? `${url}/api/student-login`
        : `${url}/api/student-register`;

      const requestData = isLogin
        ? { email: formData.email, password: formData.password }
        : { ...formData };

      const response = await axios.post(endpoint, requestData);

      if (response.data.success) {
        if (isLogin) {
          await fetchStudentData(formData.email);

          if (data.isApproved === "false") {
            setError("Not Approved. Ask Admin...");
            setLoading(false);
            return;
          }

          setToken(response.data.token);
          setEmail(formData.email);

          localStorage.setItem("token", response.data.token);
          localStorage.setItem("email", formData.email);

          onClose();
        } else {
          setFormData({
            name: "",
            email: "",
            password: "",
            agreeToTerms: false,
          });
          setIsLogin(true);
          setError("Registration successful! Please log in.");
        }
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error(`${isLogin ? "Login" : "Registration"} error:`, err);
      setError(
        err.response?.data?.message ||
          (isLogin ? "Invalid email or password" : "Registration failed")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal">
        <h2 className="auth-title">{isLogin ? "Login" : "Sign Up"}</h2>

        {error && <div className="auth-error-message">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleInputChange}
              className="auth-input"
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Your email"
            value={formData.email}
            onChange={handleInputChange}
            className="auth-input"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            className="auth-input"
            required
          />

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
            {loading
              ? isLogin
                ? "Logging in..."
                : "Registering..."
              : isLogin
              ? "Login"
              : "Sign Up"}
          </button>
        </form>

        <div className="auth-switch-container">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span
            className="auth-switch-link"
            onClick={() => {
              setIsLogin(!isLogin);
              setFormData({
                name: "",
                email: "",
                password: "",
                agreeToTerms: false,
              });
              setError("");
            }}
          >
            {isLogin ? "Sign up here" : "Login here"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
