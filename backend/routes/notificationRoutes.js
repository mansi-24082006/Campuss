import express from "express";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  broadcastNotification,
  getSentNotifications,
} from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect); // All routes protected

router.get("/", getNotifications);
router.patch("/:id/read", markAsRead);
router.patch("/read-all", markAllAsRead);
router.post("/broadcast/:eventId", allowRoles("faculty", "admin"), broadcastNotification);

export default router;
