import express from "express";
import {
  addTeacher,
  updateTeacher,
  deleteTeacher,
  approveStudent,
  getAllStudents,
  getAllTeachers,
} from "../controllers/adminControllers.js";

const adminRouter = express.Router();

adminRouter.get("/get-all-teachers", getAllTeachers);
adminRouter.post("/add-teacher", addTeacher);
adminRouter.delete("/delete-teacher/:id", deleteTeacher);
adminRouter.put("/update-teacher/:id", updateTeacher);
adminRouter.get("/get-all-students", getAllStudents);
adminRouter.put("/approve-student", approveStudent);

export default adminRouter;
