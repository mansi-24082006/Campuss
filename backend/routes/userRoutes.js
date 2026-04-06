import express from "express";
import { getProfile, getUsers, updateUserRole, deleteUser, updateProfile } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", protect, allowRoles("faculty", "admin"), getUsers);
router.get("/:id", protect, getProfile);
router.patch("/profile", protect, updateProfile);

// Admin Actions
router.patch("/:id/role", protect, allowRoles("admin"), updateUserRole);
router.delete("/:id", protect, allowRoles("admin"), deleteUser);

export default router;
