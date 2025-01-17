import React, { useState } from "react";
import "./AddTeacher.css";
import axios from "axios";
import { toast } from "react-toastify";

const AddTeacher = ({ url }) => {
  const [data, setData] = useState({
    name: "",
    teacherId: "",
    department: "",
    subject: "",
    email: "",
  });

  // Handle input changes
  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  // Handle form submission
  const onSubmitHandler = async (event) => {
    event.preventDefault();

    // Validation (optional but recommended)
    if (
      !data.name ||
      !data.teacherId ||
      !data.department ||
      !data.subject ||
      !data.email
    ) {
      toast.error("Please fill in all required fields!");
      return;
    }

    try {
      const response = await axios.post(`${url}/api/add-teacher`, data);
      if (response.data.success) {
        setData({
          name: "",
          teacherId: "",
          department: "",
          subject: "",
          email: "",
        });
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="Add">
      <form onSubmit={onSubmitHandler}>
        <div className="form-row">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={data.name}
            onChange={onChangeHandler}
            placeholder="Enter teacher's name"
            required
          />
        </div>
        <div className="form-row">
          <label htmlFor="teacherId">Teacher Id</label>
          <input
            type="number"
            id="teacherId"
            name="teacherId"
            value={data.teacherId}
            onChange={onChangeHandler}
            placeholder="Enter teacher's Id"
            required
          />
        </div>
        <div className="form-row">
          <label htmlFor="department">Department</label>
          <input
            type="text"
            id="department"
            name="department"
            value={data.department}
            onChange={onChangeHandler}
            placeholder="Enter department"
            required
          />
        </div>
        <div className="form-row">
          <label htmlFor="subject">Subject</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={data.subject}
            onChange={onChangeHandler}
            placeholder="Enter subject"
            required
          />
        </div>
        <div className="form-row">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={data.email}
            onChange={onChangeHandler}
            placeholder="Enter email"
            required
          />
        </div>
        <button type="submit" className="Add-button">
          ADD
        </button>
      </form>
    </div>
  );
};

export default AddTeacher;
