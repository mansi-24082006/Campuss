import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    collegeName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    role: { type: String, enum: ["student", "faculty", "Admin"], default: "student" },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
