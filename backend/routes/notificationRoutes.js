import express from "express";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  broadcastNotification,
  globalBroadcast,
  facultyBroadcast,
  getSentNotifications,
  subscribePush
} from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect); // All routes protected

router.get("/", getNotifications);
router.patch("/:id/read", markAsRead);
router.patch("/read-all", markAllAsRead);
router.get("/sent", allowRoles("faculty", "admin"), getSentNotifications);
router.post("/broadcast/:eventId", allowRoles("faculty", "admin"), broadcastNotification);
router.post("/global-broadcast", allowRoles("admin"), globalBroadcast);
router.post("/faculty-broadcast", allowRoles("faculty"), facultyBroadcast);
router.post("/subscribe", subscribePush);

export default router;
