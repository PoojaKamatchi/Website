import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserAddress,
  updateUserProfile,
  forgotPassword,
  verifyOtp,
  resetPassword
} from "../controllers/userController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.put("/reset-password", resetPassword);

router.get("/profile", protect, getUserProfile);
router.put("/update-address", protect, updateUserAddress);
router.put("/update-profile", protect, updateUserProfile);

export default router;
