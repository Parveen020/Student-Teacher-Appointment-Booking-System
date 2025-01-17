import express from "express";
import {
  getTeacher,
  loginTeacher,
  updateTeacher,
  updateHandler,
  deleteHandler,
  getAppointments,
} from "../controllers/teacherController.js";

const teacherRouter = express.Router();

teacherRouter.post("/getTeacher", getTeacher);
teacherRouter.post("/teacher-login", loginTeacher);
teacherRouter.put("/teacher-update/:id", updateTeacher);
teacherRouter.put("/teacher/update-appointment", updateHandler);
teacherRouter.delete("/teacher/delete-appointment", deleteHandler);
teacherRouter.post("/teacher/get-all-appointments", getAppointments);

export default teacherRouter;
