import express from "express";
import {
  registerUser,
  loginUser,
  adminLogin,
  verifyAdminOtp,
  forgotAdminPassword,
  resetAdminPassword,
  getAllUsers,
  registerAdmin, // New admin registration
} from "../controllers/authController.js";
import { protect, adminProtect } from "../middleware/authMiddleware.js";

const router = express.Router();

// USER ROUTES
router.post("/register", registerUser);
router.post("/login", loginUser);

// ADMIN ROUTES
router.post("/admin/login", adminLogin);             // Request OTP
router.post("/admin/verify-otp", verifyAdminOtp);   // Verify OTP
router.post("/admin/forgot-password", forgotAdminPassword);
router.put("/admin/reset-password/:token", resetAdminPassword);

// ADMIN ONLY: Add another admin
router.post("/admin/register", adminProtect, registerAdmin);

// ADMIN ONLY: GET USERS
router.get("/admin/users", adminProtect, getAllUsers);

export default router;
