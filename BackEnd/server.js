import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import adminRouter from "./routes/adminRoutes.js";
import multer from "multer";
import studentRouter from "./routes/studentRoutes.js";
import "dotenv/config";
import teacherRouter from "./routes/teacherRoutes.js";

const app = express();
const port = 4000;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// db connection
connectDB();

//hanlding form data
const upload = multer();

//api routes
app.use("/api", upload.none(), adminRouter);
app.use("/api", studentRouter);
app.use("/api", teacherRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
