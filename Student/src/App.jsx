import "./App.css";
import React, { useContext, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import SearchTeacher from "./pages/SearchTeacher/SearchTeacher";
import Footer from "./components/Footer/Footer";
import Login from "./components/Login/Login";
import Appointments from "./pages/Appointments/Appointments";
import { ToastContainer } from "react-toastify";
import { StudentContext } from "./context/studentContext";

function App() {
  const { url, showLogin, setShowLogin, token } = useContext(StudentContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setShowLogin(false);
    } else {
      setShowLogin(true);
    }
  }, []);

  return (
    <>
      <ToastContainer />
      {showLogin ? <Login onClose={() => setShowLogin(false)} /> : <></>}
      <div>
        <Navbar />
        <hr />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/searchTeacher" element={<SearchTeacher />} />
          <Route path="/view-all-appointments" element={<Appointments />} />
        </Routes>
        <Footer />
      </div>
    </>
  );
}

export default App;
