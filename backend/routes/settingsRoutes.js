import express from "express";
import { getSettings, updateSettings } from "../controllers/settings.Controller.js";
const router = express.Router();

router.get("/", getSettings);
router.patch("/", updateSettings);

export default router;
