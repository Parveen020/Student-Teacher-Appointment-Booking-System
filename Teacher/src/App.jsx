import { useState, useEffect, useContext } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home/Home";
import ViewAppointments from "./pages/ViewAppointments/ViewAppointments";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Login from "./components/Login/Login";
import UpdateProfile from "./pages/updateProfile/UpdateProfile";
import { ToastContainer } from "react-toastify";
import { TeacherContext } from "./context/teacherAuthContext";

function App() {
  const { url, showLogin, setShowLogin, token } = useContext(TeacherContext);

  useEffect(() => {
    if (token) {
      setShowLogin(false);
    } else {
      setShowLogin(true);
    }
  }, []);

  return (
    <>
      <ToastContainer />
      {showLogin && <Login onClose={() => setShowLogin(false)} />}
      <div>
        <Navbar />
        <hr />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/viewAppointments" element={<ViewAppointments />} />
          <Route path="/updateProfile" element={<UpdateProfile />} />
        </Routes>
        <Footer />
      </div>
    </>
  );
}

export default App;
