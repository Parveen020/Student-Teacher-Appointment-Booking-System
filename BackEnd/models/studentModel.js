import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rollNo: { type: String, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isApproved: { type: Boolean, default: false },

    appointments: {
      type: [
        {
          _id: {
            type: mongoose.Schema.Types.ObjectId,
            default: () => new mongoose.Types.ObjectId(),
          },
          date: String,
          time: String,
          studentName: String,
          studentRollNo: String,
          teacherName: String,
          teacherId: String,
          department: String,
          subject: String,
          messsage: String,
          status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
          },
          timestamp: String,
        },
      ],
      default: [],
    },
  },
  { minimize: false }
);

studentSchema.pre("save", async function (next) {
  if (!this.rollNo) {
    try {
      // Get the total number of students in the database
      const studentCount = await mongoose.models.student.countDocuments();

      // Generate the roll number
      this.rollNo = `2024${studentCount + 1}`;
    } catch (error) {
      console.error("Error generating roll number:", error);
      return next(error);
    }
  }
  next();
});

const studentModel =
  mongoose.models.student || mongoose.model("student", studentSchema);
export default studentModel;
