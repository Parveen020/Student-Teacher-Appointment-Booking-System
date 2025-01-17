import teacherModel from "../models/teacherModel.js";
import studentModel from "../models/studentModel.js";
import bcrypt from "bcrypt";

//extract all teachers from teachers
const getAllTeachers = async (req, res) => {
  try {
    const teachers = await teacherModel.find(
      {},
      {
        name: 1,
        teacherId: 1,
        department: 1,
        subject: 1,
        email: 1,
        _id: 0,
      }
    );

    res.status(200).send({
      success: true,
      message: "Teachers Retrieved Successfully",
      data: teachers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while fetching teachers",
    });
  }
};

// add a new teacher
const addTeacher = async (req, res) => {
  console.log(req.body);
  const teacher = new teacherModel({
    name: req.body.name,
    teacherId: req.body.teacherId,
    department: req.body.department,
    subject: req.body.subject,
    email: req.body.email,
  });
  try {
    await teacher.save();
    res
      .status(200)
      .send({ success: true, message: "teacher Added Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Teacher Not Added i.e. ther is some error",
    });
  }
};

// update a teacher
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

    console.log(existingTeacher);

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
        department: req.body.department || existingTeacher.department,
        subject: req.body.subject || existingTeacher.subject,
        email: existingTeacher.email,
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

// delete a teacher
const deleteTeacher = async (req, res) => {
  try {
    const teacherId = req.params.id;
    await teacherModel.findOneAndDelete({ teacherId: teacherId });
    res.status(200).send({
      success: true,
      message: "Teacher Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Teacher Not xeleted i.e. error in delete API",
    });
  }
};

// get all students from student
const getAllStudents = async (req, res) => {
  try {
    const students = await studentModel.find(
      {},
      {
        name: 1,
        rollNo: 1,
        email: 1,
        isApproved: 1,
      }
    );
    res.status(200).send({
      success: true,
      message: "Students Retrieved Successfully",
      data: students,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while fetching students",
    });
  }
};

//approve student regitration
const approveStudent = async (req, res) => {
  try {
    const { studentRollNo, isApproved, status } = req.body;

    if (!studentRollNo) {
      return res
        .status(400)
        .send({ success: false, message: "Student Roll Number is required" });
    }

    if (isApproved === undefined || status === undefined) {
      return res
        .status(400)
        .send({ success: false, message: "Approval status is required" });
    }

    const updatedStudent = await studentModel.findOneAndUpdate(
      { rollNo: studentRollNo },
      {
        isApproved,
        status,
      },
      { new: true }
    );

    if (!updatedStudent) {
      return res
        .status(404)
        .send({ success: false, message: "Student not found" });
    }

    res.status(200).send({
      success: true,
      message: `Student status updated to ${status} successfully`,
      student: updatedStudent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error occurred while updating student status",
    });
  }
};

export {
  getAllTeachers,
  addTeacher,
  updateTeacher,
  deleteTeacher,
  getAllStudents,
  approveStudent,
};
