import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: String,
    organizer: String,
    date: Date,
    category: String,
    participants: Number,
    status: {
      type: String,
      enum: ["active", "upcoming", "completed"],
    },
    description: String,
  },
  { timestamps: true },
);

export default mongoose.model("Event", eventSchema);
