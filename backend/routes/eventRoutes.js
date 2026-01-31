import express from "express";
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";
import { protect } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/", protect, getEvents);
router.post("/", protect, allowRoles("admin"), createEvent);
router.put("/:id", protect, allowRoles("admin"), updateEvent);
router.delete("/:id", protect, allowRoles("admin"), deleteEvent);

export default router;
