import express from "express";
import { submitGeneralFeedback, getGeneralFeedback } from "../controllers/feedbackController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, allowRoles("student"), submitGeneralFeedback);
router.get("/", protect, allowRoles("admin", "faculty"), getGeneralFeedback);

export default router;
