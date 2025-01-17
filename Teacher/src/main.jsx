import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import TeacherContextProvider from "./context/teacherAuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <TeacherContextProvider>
      <App />
    </TeacherContextProvider>
  </BrowserRouter>
);
