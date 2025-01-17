import { createContext, useState, useEffect } from "react";
import axios from "axios";
export const StudentContext = createContext(null);

const StudentContextProvider = (props) => {
  const url = "http://localhost:4000";
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [data, setData] = useState({
    name: "",
    rollNo: "",
    email: "",
    isApproved: "",
    appointment: [],
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedEmail = localStorage.getItem("email");
    if (storedToken && storedEmail) {
      setToken(storedToken);
      setEmail(storedEmail);
      fetchStudentData(storedEmail);
    }
  }, []);

  const fetchStudentData = async (studentEmail) => {
    try {
      const response = await axios.post(`${url}/api/getStudent`, {
        email: studentEmail,
      });

      if (response.data.success && response.data.student) {
        setData(response.data.student);
        console.log(response.data.student);
        localStorage.setItem("data", JSON.stringify(response.data.student));
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  const contextValue = {
    url,
    token,
    setToken,
    email,
    setEmail,
    data,
    setData,
    showLogin,
    setShowLogin,
    fetchStudentData,
  };

  return (
    <StudentContext.Provider value={contextValue}>
      {props.children}
    </StudentContext.Provider>
  );
};

export default StudentContextProvider;
