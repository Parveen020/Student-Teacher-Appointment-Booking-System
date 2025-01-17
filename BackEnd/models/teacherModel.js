import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    teacherId: {
      type: String,
      required: function () {
        return this.isEnrolling;
      },
    },
    department: { type: String, required: true },
    subject: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, default: "" },
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
          message: String,
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
    firstLogin: { type: Boolean, default: true },
  },
  { minimize: false }
);

teacherSchema.pre("save", function (next) {
  if (!Array.isArray(this.messages)) {
    this.messages = [];
  }
  delete this.isEnrolling;
  next();
});

const teacherModel =
  mongoose.models.teacher || mongoose.model("teacher", teacherSchema);
export default teacherModel;
