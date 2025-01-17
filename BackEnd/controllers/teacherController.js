import teacherModel from "../models/teacherModel.js";
import studentModel from "../models/studentModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const getTeacher = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const teacher = await teacherModel.findOne({ email: email });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    const token = createToken(teacher._id);

    res.status(200).json({
      success: true,
      token,
      teacher: {
        _id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        teacherId: teacher.teacherId,
        department: teacher.department,
        subject: teacher.subject,
        password: teacher.password,
        messages: teacher.messages,
        appointments: teacher.appointments,
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

const loginTeacher = async (req, res) => {
  const { email, password } = req.body;
  try {
    const teacher = await teacherModel.findOne({ email: email });
    if (!teacher) {
      return res.json({ success: false, message: "Teacher does not exist" });
    }

    if (teacher.firstLogin) {
      console.log("First time login");
      teacher.firstLogin = false;
      await teacher.save();
    } else {
      const isMatch = await bcrypt.compare(password, teacher.password);
      if (!isMatch) {
        return res.json({ success: false, message: "Invalid credentials" });
      }
    }

    const token = createToken(teacher._id);
    res.json({
      success: true,
      token,
      teacher: {
        _id: teacher._id,
        email: teacher.email,
        messages: teacher.messages || [],
        appointments: teacher.appointments || [],
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

const updateTeacher = async (req, res) => {
  try {
    const teacherId = req.params.id;
    const existingTeacher = await teacherModel.findOne({
      teacherId: teacherId,
    });

    if (!existingTeacher) {
      return res
        .status(500)
        .send({ success: false, message: "Teacher not found" });
    }

    // Hashing the new password if provided in the request body
    let hashedPassword = existingTeacher.password; // Default to existing password
    if (req.body.password) {
      // Only hash if new password is provided
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(req.body.password, salt);
    }

    // Update teacher document with new values
    const updatedTeacher = await teacherModel.findOneAndUpdate(
      { teacherId: teacherId },
      {
        name: req.body.name || existingTeacher.name,
        teacherId: existingTeacher.teacherId,
        email: req.body.email || existingTeacher.email,
        department: req.body.department || existingTeacher.department,
        subject: req.body.subject || existingTeacher.subject,
        password: hashedPassword, // Save the hashed password
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Teacher Updated Successfully",
      updatedTeacher,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Teacher Not Updated: error in Update API",
    });
  }
};

const updateAppointment = async ({
  appointmentId,
  teacherId,
  updatedDate,
  updatedTime,
  status,
}) => {
  try {
    const teacher = await teacherModel.findOne({ teacherId });

    if (!teacher) {
      return { status: 404, message: "Teacher not found" };
    }

    const appointmentIndex = teacher.appointments.findIndex(
      (app) => app._id.toString() === appointmentId
    );

    if (appointmentIndex === -1) {
      return { status: 404, message: "Appointment not found" };
    }

    // Update appointment details in the teacher's record
    if (updatedDate) teacher.appointments[appointmentIndex].date = updatedDate;
    if (updatedTime) teacher.appointments[appointmentIndex].time = updatedTime;
    if (status) teacher.appointments[appointmentIndex].status = status;

    // Find the student associated with the appointment
    const studentRollNo = teacher.appointments[appointmentIndex].studentRollNo;
    const student = await studentModel.findOne({ rollNo: studentRollNo });
    console.log("Student ID:", studentRollNo);

    if (!student) {
      return { status: 404, message: "Student not found" };
    }

    const studentAppointmentIndex = student.appointments.findIndex(
      (app) => app._id.toString() === appointmentId
    );

    if (studentAppointmentIndex === -1) {
      return {
        status: 404,
        message: "Appointment not found in student's record",
      };
    }

    // Update appointment details in the student's record
    if (updatedDate)
      student.appointments[studentAppointmentIndex].date = updatedDate;
    if (updatedTime)
      student.appointments[studentAppointmentIndex].time = updatedTime;
    if (status) student.appointments[studentAppointmentIndex].status = status;

    // Save both teacher and student records
    await teacher.save();
    await student.save();

    return {
      status: 200,
      message: "Appointment updated successfully",
      appointments: teacher.appointments,
    };
  } catch (error) {
    console.error("Error updating appointment:", error);
    return { status: 500, message: "Internal server error" };
  }
};

const updateHandler = async (req, res) => {
  const { appointmentId, teacherId, updatedDate, updatedTime, status } =
    req.body;

  const result = await updateAppointment({
    appointmentId,
    teacherId,
    updatedDate,
    updatedTime,
    status,
  });

  return res
    .status(result.status)
    .json({ message: result.message, appointments: result.appointments });
};

// Function to delete an appointment
const deleteAppointment = async ({ appointmentId, teacherId }) => {
  try {
    const teacher = await teacherModel.findOne({ teacherId });

    if (!teacher) {
      return { status: 404, message: "Teacher not found" };
    }

    // Find and remove the appointment
    const appointmentIndex = teacher.appointments.findIndex(
      (app) => app._id.toString() === appointmentId
    );

    if (appointmentIndex === -1) {
      return { status: 404, message: "Appointment not found" };
    }

    teacher.appointments.splice(appointmentIndex, 1);
    await teacher.save();

    return {
      status: 200,
      message: "Appointment deleted successfully",
      appointments: teacher.appointments,
    };
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return { status: 500, message: "Internal server error" };
  }
};

// Route handler
const deleteHandler = async (req, res) => {
  const { appointmentId, teacherId } = req.body;

  const result = await deleteAppointment({
    appointmentId,
    teacherId,
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
    const teacher = await teacherModel.findOne({ email });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    // Return appointments array
    return res.status(200).json({
      success: true,
      message: "Appointments fetched successfully",
      appointments: teacher.appointments || [],
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
  loginTeacher,
  updateTeacher,
  getTeacher,
  updateHandler,
  deleteHandler,
  getAppointments,
};
