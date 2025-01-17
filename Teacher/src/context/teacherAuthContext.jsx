import { createContext, useEffect, useState } from "react";
import axios from "axios";
export const TeacherContext = createContext(null);

const TeacherContextProvider = (props) => {
  const url = "http://localhost:4000";
  const [showLogin, setShowLogin] = useState(true);
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [data, setData] = useState({
    name: "",
    teacherId: "",
    department: "",
    subject: "",
    email: "",
    password: "",
    messages: [],
    appointments: [],
    firstLogin: true,
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedEmail = localStorage.getItem("email");
    if (storedToken && storedEmail) {
      setToken(storedToken);
      setEmail(storedEmail);
      fetchTeacherData(storedEmail);
    }
  }, []);

  const fetchTeacherData = async (teacherEmail) => {
    try {
      const response = await axios.post(`${url}/api/getTeacher`, {
        email: teacherEmail,
      });

      if (response.data.success && response.data.teacher) {
        setData(response.data.teacher);
        console.log(response.data.teacher.message);
        localStorage.setItem("data", JSON.stringify(response.data.teacher));
      }
    } catch (error) {
      console.error("Error fetching teacher data:", error);
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
    fetchTeacherData,
  };

  return (
    <TeacherContext.Provider value={contextValue}>
      {props.children}
    </TeacherContext.Provider>
  );
};

export default TeacherContextProvider;
