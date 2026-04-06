import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: String,
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // The primary manager (assigned faculty)
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // The actual creator (Admin or Faculty)
    assignedFaculty: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Mirror of organizer if assigned
    date: Date,
    endDate: Date,
    category: String,
    // New enum type for better filter support
    type: {
      type: String,
      enum: ["hackathon", "seminar", "tech-fest", "competition", "workshop", "other"],
      default: "other",
    },
    participationLevel: {
      type: String,
      enum: ["College", "State", "National"],
      default: "College",
    },
    speakerDetails: String, // Legacy field
    speakers: [
      {
        name: String,
        organization: String,
        bio: String,
        sessionTitle: String,
        sessionTime: String,
        photoUrl: String,
        socialLinks: {
          linkedin: String,
          twitter: String,
          website: String,
        },
      },
    ],
    registrationLimit: { type: Number, default: 0 },
    enableWaitlist: { type: Boolean, default: false },
    waitlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    venue: String,
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed", "active", "upcoming"],
      default: "pending",
    },
    description: String,
    prizeDetails: String,
    rules: String,
    winners: [
      {
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        position: String,
        points: Number,
      },
    ],
    registeredStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    attendedStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    verifiedStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // Feedback from students after event
    feedback: [
      {
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        studentName: String,
        rating: { type: Number, min: 1, max: 5 },
        comment: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("Event", eventSchema);
