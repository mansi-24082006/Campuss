import express from "express";
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  updateEventStatus,
  registerForEvent,
  joinWaitlist,
  markAttendance,
  getPendingEvents,
  updateWinnerList,
  getLeaderboard,
  getRecommendations,
  verifyCertificate,
  verifyStudentForCertificate,
  submitFeedback,
  getEventFeedback,
  getAdminReports,
} from "../controllers/eventController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", protect, getEvents);
router.get("/:id", protect, getEventById);
router.post("/", protect, allowRoles("faculty", "admin"), createEvent);
router.put("/:id", protect, allowRoles("faculty", "admin"), updateEvent);
router.delete("/:id", protect, allowRoles("admin"), deleteEvent);

// Status update (Approve/Reject)
router.patch("/:id/status", protect, allowRoles("admin"), updateEventStatus);

// Admin Approval Queue
router.get("/admin/pending", protect, allowRoles("admin"), getPendingEvents);

// Admin Reports
router.get("/admin/reports", protect, allowRoles("admin"), getAdminReports);

// Public Verification
router.get("/verify/:certId", verifyCertificate);

// Recommendations & Leaderboard
router.get("/student/recommendations", protect, allowRoles("student"), getRecommendations);
router.get("/global/leaderboard", protect, getLeaderboard);

// Registration + Waitlist
router.post("/:id/register", protect, allowRoles("student"), registerForEvent);
router.post("/:id/waitlist", protect, allowRoles("student"), joinWaitlist);

// Attendance & Winners
router.post("/:id/attendance", protect, allowRoles("faculty", "admin"), markAttendance);
router.post("/:id/verify-certificate", protect, allowRoles("faculty", "admin"), verifyStudentForCertificate);
router.post("/:id/winners", protect, allowRoles("faculty", "admin"), updateWinnerList);

// Feedback
router.post("/:id/feedback", protect, allowRoles("student"), submitFeedback);
router.get("/:id/feedback", protect, allowRoles("faculty", "admin"), getEventFeedback);

export default router;
