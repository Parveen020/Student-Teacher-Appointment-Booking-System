import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar/Navbar";
import AddTeacher from "./pages/AddTeacher/AddTeacher";
import TeacherList from "./pages/TeacherList/TeacherList";
import ApproveStudent from "./pages/ApproveStudent/ApproveStudent";

function App() {
  const url = "http://localhost:4000";
  return (
    <div>
      <ToastContainer />
      <Navbar />
      <hr />
      <div className="app-content">
        <Routes>
          <Route path="/add" element={<AddTeacher url={url} />} />
          <Route path="/teacher-list" element={<TeacherList url={url} />} />
          <Route
            path="/approve-student"
            element={<ApproveStudent url={url} />}
          />
        </Routes>
      </div>
      <hr />
    </div>
  );
}

export default App;
