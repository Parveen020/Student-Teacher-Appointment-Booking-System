import studentModel from "../models/studentModel.js";
import teacherModel from "../models/teacherModel.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// get student
const getStudent = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const student = await studentModel.findOne({ email: email });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "student not found",
      });
    }

    const token = createToken(student._id);

    res.status(200).json({
      success: true,
      token,
      student: {
        _id: student._id,
        name: student.name,
        email: student.email,
        rollNo: student.rollNo,
        password: student.password,
        isApproved: student.isApproved,
        messages: student.messages,
        appointments: student.appointments,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// login user
const loginStudent = async (req, res) => {
  const { email, password } = req.body;
  try {
    const student = await studentModel.findOne({ email: email });
    if (!student) {
      return res.json({ success: false, message: "Student does not exist" });
    }
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }
    const token = createToken(student._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// register user
const registerStudent = async (req, res) => {
  const { name, password, email } = req.body;
  try {
    // Checking if the student already exists
    const exists = await studentModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "Student already exists" });
    }

    // Validating email format and strong password
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // Hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Creating a new student instance
    const newStudent = new studentModel({
      name: name,
      email: email,
      password: hashedPassword,
      status: false,
      messages: {},
      appointments: {},
    });

    const student = await newStudent.save();
    const token = createToken(student._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error occurred during registration" });
  }
};

const migrateTeacherMessages = async () => {
  try {
    const teachers = await teacherModel.find({});

    for (const teacher of teachers) {
      if (!Array.isArray(teacher.messages)) {
        await teacherModel.updateOne(
          { _id: teacher._id },
          { $set: { messages: [] } }
        );
        console.log(`Fixed messages for teacher: ${teacher.email}`);
      }
    }
    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Migration error:", error);
  }
};

const sendMessageFromStudent = async ({
  studentEmail,
  teacherEmail,
  message,
}) => {
  try {
    if (!studentEmail || !teacherEmail || !message) {
      throw new Error("Missing required fields");
    }

    // Run migration first to ensure data consistency
    await migrateTeacherMessages();

    const [student, teacher] = await Promise.all([
      studentModel.findOne({ email: studentEmail }),
      teacherModel.findOne({ email: teacherEmail }),
    ]);

    if (!student)
      throw new Error(`Student not found with email: ${studentEmail}`);
    if (!teacher)
      throw new Error(`Teacher not found with email: ${teacherEmail}`);

    const messageData = {
      _id: new mongoose.Types.ObjectId(),
      content: message,
      timestamp: new Date().toISOString(),
      senderName: student.name,
      senderRollNo: student.rollNo,
      senderType: "student",
      status: "unread",
    };

    // Use $set first to ensure messages is an array, then push the new message
    await Promise.all([
      teacherModel.updateOne({ _id: teacher._id }, [
        {
          $set: {
            messages: {
              $cond: {
                if: { $isArray: "$messages" },
                then: "$messages",
                else: [],
              },
            },
          },
        },
        {
          $set: {
            messages: {
              $concatArrays: ["$messages", [messageData]],
            },
          },
        },
      ]),
      studentModel.updateOne({ _id: student._id }, [
        {
          $set: {
            messages: {
              $cond: {
                if: { $isArray: "$messages" },
                then: "$messages",
                else: [],
              },
            },
          },
        },
        {
          $set: {
            messages: {
              $concatArrays: ["$messages", [messageData]],
            },
          },
        },
      ]),
    ]);

    return {
      success: true,
      message: "Message sent successfully",
      data: {
        messageData,
        teacher: {
          name: teacher.name,
          teacherId: teacher.teacherId,
        },
      },
    };
  } catch (error) {
    console.error("Error in sendMessageFromStudent:", error);
    throw error;
  }
};

// 5. API endpoint handler
const handleSendMessage = async (req, res) => {
  try {
    const { studentEmail, teacherEmail, message } = req.body;
    const result = await sendMessageFromStudent({
      studentEmail,
      teacherEmail,
      message,
    });
    res.status(200).json(result);
  } catch (error) {
    console.error("API Error:", error);
    const statusCode = error.message.includes("not found")
      ? 404
      : error.message.includes("required fields")
      ? 400
      : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to send message",
      error: error.toString(),
    });
  }
};

// API for booking an appointment
const migrateTeacherAppointments = async () => {
  try {
    const teachers = await teacherModel.find({});

    for (const teacher of teachers) {
      if (!Array.isArray(teacher.appointments)) {
        await teacherModel.updateOne(
          { _id: teacher._id },
          { $set: { appointments: [] } }
        );
        console.log(`Fixed appointments for teacher: ${teacher.email}`);
      }
    }
    console.log("Appointment migration completed successfully");
  } catch (error) {
    console.error("Migration error:", error);
  }
};

// 2. Updated booking function with migration and safe updates
const bookAppointment = async ({
  studentEmail,
  teacherEmail,
  date,
  time,
  message,
}) => {
  try {
    // Validate inputs
    if (!studentEmail || !teacherEmail || !date || !time || !message) {
      throw new Error("Missing required fields");
    }

    // Validate date and time format
    const appointmentDate = new Date(`${date}T${time}`);
    if (isNaN(appointmentDate.getTime())) {
      throw new Error("Invalid date or time format");
    }

    // Check if date is in the future
    if (appointmentDate < new Date()) {
      throw new Error("Appointment must be in the future");
    }

    // Run migration first to ensure data consistency
    await migrateTeacherAppointments();

    // Find student and teacher
    const [student, teacher] = await Promise.all([
      studentModel.findOne({ email: studentEmail }),
      teacherModel.findOne({ email: teacherEmail }),
    ]);

    if (!student)
      throw new Error(`Student not found with email: ${studentEmail}`);
    if (!teacher)
      throw new Error(`Teacher not found with email: ${teacherEmail}`);

    // Create appointment data
    const appointmentData = {
      _id: new mongoose.Types.ObjectId(),
      message,
      date,
      time,
      studentName: student.name,
      studentRollNo: student.rollNo,
      teacherName: teacher.name,
      teacherId: teacher.teacherId,
      department: teacher.department,
      subject: teacher.subject,
      status: "pending",
      timestamp: new Date().toISOString(),
    };

    // Use updateOne with aggregation pipeline to safely handle the appointments array
    await Promise.all([
      teacherModel.updateOne({ _id: teacher._id }, [
        {
          $set: {
            appointments: {
              $cond: {
                if: { $isArray: "$appointments" },
                then: "$appointments",
                else: [],
              },
            },
          },
        },
        {
          $set: {
            appointments: {
              $concatArrays: ["$appointments", [appointmentData]],
            },
          },
        },
      ]),
      studentModel.updateOne({ _id: student._id }, [
        {
          $set: {
            appointments: {
              $cond: {
                if: { $isArray: "$appointments" },
                then: "$appointments",
                else: [],
              },
            },
          },
        },
        {
          $set: {
            appointments: {
              $concatArrays: ["$appointments", [appointmentData]],
            },
          },
        },
      ]),
    ]);

    return {
      success: true,
      message: "Appointment booked successfully",
      data: {
        appointmentData,
        teacher: {
          name: teacher.name,
          teacherId: teacher.teacherId,
        },
      },
    };
  } catch (error) {
    console.error("Error in bookAppointment:", error);
    throw error;
  }
};

// 3. API endpoint handler
const handleBookAppointment = async (req, res) => {
  try {
    const { studentEmail, teacherEmail, date, time, message } = req.body;
    const result = await bookAppointment({
      studentEmail,
      teacherEmail,
      date,
      time,
      message,
    });
    res.status(200).json(result);
  } catch (error) {
    console.error("API Error:", error);
    const statusCode = error.message.includes("not found")
      ? 404
      : error.message.includes("required fields")
      ? 400
      : error.message.includes("already has an appointment")
      ? 409
      : 500;

    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to book appointment",
      error: error.toString(),
    });
  }
};

// Function to delete an appointment
const deleteAppointment = async ({ appointmentId, studentId }) => {
  try {
    const student = await studentModel.findOne({ studentId });

    if (!student) {
      return { status: 404, message: "Student not found" };
    }

    // Find and remove the appointment
    const appointmentIndex = student.appointments.findIndex(
      (app) => app._id.toString() === appointmentId
    );

    if (appointmentIndex === -1) {
      return { status: 404, message: "Appointment not found" };
    }

    student.appointments.splice(appointmentIndex, 1);
    await student.save();

    return {
      status: 200,
      message: "Appointment deleted successfully",
      appointments: student.appointments,
    };
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return { status: 500, message: "Internal server error" };
  }
};

// Route handler
const deleteHandler = async (req, res) => {
  const { appointmentId, studentId } = req.body;

  const result = await deleteAppointment({
    appointmentId,
    studentId,
  });

  return res
    .status(result.status)
    .json({ message: result.message, appointments: result.appointments });
};

const getAppointments = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find student
    const student = await studentModel.findOne({ email });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Return appointments array
    return res.status(200).json({
      success: true,
      message: "Appointments fetched successfully",
      appointments: student.appointments,
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching appointments",
      error: error.message,
    });
  }
};
export {
  getStudent,
  loginStudent,
  registerStudent,
  handleSendMessage,
  handleBookAppointment,
  deleteHandler,
  getAppointments,
};
