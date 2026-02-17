import express from "express";
import { getProfile, updateProfile } from "../controllers/profileController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* Profile Routes */
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

export default router;
