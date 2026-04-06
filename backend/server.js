import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";

import notificationRoutes from "./routes/notificationRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import cron from "node-cron";
import Event from "./models/Event.js";
import User from "./models/User.js";
import { sendEmail, getReminderTemplate } from "./utils/emailService.js";
import Notification from "./models/Notification.js";

dotenv.config();

// REMINDER SYSTEM: Scheduled tasks (Cron Job)
// Runs every hour to check for upcoming events
cron.schedule("0 * * * *", async () => {
  console.log("⏰ Running Scheduled Event Reminders...");
  try {
    const now = new Date();
    const target24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const target1h = new Date(now.getTime() + 1 * 60 * 60 * 1000);

    // Find active/approved events starting in approx 24 hours or 1 hour
    const upcomingEvents = await Event.find({
      status: "approved",
      date: { $gt: now, $lt: target24h }
    }).populate("registeredStudents", "fullName email");

    for (const event of upcomingEvents) {
      const timeDiff = event.date.getTime() - now.getTime();
      const hoursDiff = Math.round(timeDiff / (1000 * 60 * 60));

      // Trigger reminder if it's almost exactly 24h or 1h away
      if (hoursDiff === 24 || hoursDiff === 1) {
        for (const student of event.registeredStudents) {
          // 1. Send Email
          if (student.email) {
            await sendEmail({
              to: student.email,
              subject: `Reminder: ${event.title} in ${hoursDiff} hour(s)! ⏰`,
              html: getReminderTemplate(student.fullName, event, hoursDiff)
            });
          }

          // 2. Send In-app Alert
          await Notification.create({
            recipient: student._id,
            message: `⏰ Reminder: "${event.title}" starts in ${hoursDiff} hour(s). See you there!`,
            type: "warning",
            link: `/event/${event._id}`
          });
        }
      }
    }
  } catch (error) {
    console.error("Cron Error:", error);
  }
});

const app = express();
const PORT = process.env.PORT || 5000;

// CORS - Explicit configuration
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  }),
);

app.use(express.json());

// Health check
app.get("/", (req, res) => res.send("CampusBuzz API is running..."));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/users", userRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/ai", aiRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  // Connect to DB after starting server
  connectDB().catch(err => console.error("DB Connection Error:", err));
});
