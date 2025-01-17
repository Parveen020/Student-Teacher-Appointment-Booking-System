import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import StudentContextProvider from "./context/studentContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <StudentContextProvider>
      <App />
    </StudentContextProvider>
  </BrowserRouter>
);
