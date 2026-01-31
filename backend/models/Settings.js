import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  allowRegistrations: Boolean,
  maintenanceMode: Boolean,
  certificateAutoIssue: Boolean,
  accessLevel: {
    type: String,
    enum: ["admin", "faculty"],
    default: "admin",
  },
});

export default mongoose.model("Settings", settingsSchema);
