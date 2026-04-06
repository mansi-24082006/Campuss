import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    certificateId: { type: String, unique: true, required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    issueDate: { type: Date, default: Date.now },
    status: { type: String, enum: ["issued", "revoked"], default: "issued" },
    metadata: {
      studentName: String,
      eventTitle: String,
      organizerName: String,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Certificate", certificateSchema);
