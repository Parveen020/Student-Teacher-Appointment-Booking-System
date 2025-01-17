import express from "express";
import {
  loginStudent,
  registerStudent,
  handleSendMessage,
  handleBookAppointment,
  getStudent,
  deleteHandler,
  getAppointments,
} from "../controllers/studentControllers.js";

const studentRouter = express.Router();
studentRouter.post("/getStudent", getStudent);
studentRouter.post("/student-register", registerStudent);
studentRouter.post("/student-login", loginStudent);
studentRouter.post("/student/send-message", handleSendMessage);
studentRouter.post("/student/book-appointment", handleBookAppointment);
studentRouter.delete("/student/delete-appointment", deleteHandler);
studentRouter.post("/student/get-all-appointments", getAppointments);

export default studentRouter;
