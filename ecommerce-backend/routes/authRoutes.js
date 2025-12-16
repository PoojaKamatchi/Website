import express from "express";
import {
  registerUser,
  verifyRegisterOtp,
  loginUser,
  forgotPassword,
  verifyOtp,
  resetPassword,
  getProfile,
  adminLogin,
  forgotAdminPassword,
  resetAdminPassword,
  registerAdmin,
  getAllUsers,
} from "../controllers/authController.js";

import { adminProtect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ---------- USER ----------
router.post("/register-otp", registerUser);       // Register with OTP
router.post("/verify-register-otp", verifyRegisterOtp); // Verify registration OTP
router.post("/login", loginUser);                 // Login
router.post("/forgot-password", forgotPassword); // Forgot password (send OTP)
router.post("/verify-otp", verifyOtp);           // Verify OTP for password reset
router.put("/reset-password", resetPassword);    // Reset password
router.get("/profile/:userId", getProfile);      // Get user profile

// ---------- ADMIN ----------
router.post("/admin/login", adminLogin);
router.post("/admin/forgot-password", forgotAdminPassword);
router.put("/admin/reset-password/:token", resetAdminPassword);

// ---------- ADMIN PROTECTED ----------
router.post("/admin/register", adminProtect, registerAdmin);
router.get("/admin/users", adminProtect, getAllUsers);

export default router;
