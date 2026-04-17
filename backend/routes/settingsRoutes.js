import express from "express";
import { getSettings, updateSettings, getSystemLogs } from "../controllers/settings.Controller.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", getSettings);
router.patch("/", updateSettings);
router.get("/logs", protect, allowRoles("admin"), getSystemLogs);

export default router;
