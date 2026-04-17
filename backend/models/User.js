import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fullName: String,
    collegeName: String,
    state: { type: String, default: "Gujarat" }, // Default state for this region
    department: String,
    departmentInterests: [String],
    phoneNumber: String,
    email: { type: String, unique: true },
    password: String,
    role: {
      type: String,
      enum: ["admin", "faculty", "student"],
      default: "student",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "pending"],
      default: "active",
    },
    points: {
      type: Number,
      default: 0,
    },
    eventsAttended: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
    certificates: [
      {
        eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
        issueDate: { type: Date, default: Date.now },
        certificateUrl: String,
      },
    ],
    ranking: {
      college: { type: Number, default: 0 },
      state: { type: Number, default: 0 },
      national: { type: Number, default: 0 },
    },
    badges: [String],
    flags: [
      {
        reason: String,
        flaggedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

export default mongoose.model("User", userSchema);
