import express from "express";
import {
  registerUser,
  loginUser,
  adminLogin,
  forgotAdminPassword,
  resetAdminPassword,
  registerAdmin,
  getAllUsers,

  // ✅ ADD THESE
  forgotUserPassword,
  resetUserPassword,
  verifyUserOtp,
} from "../controllers/authController.js";

import { adminProtect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ---------- USER ----------
router.post("/register", registerUser);
router.post("/login", loginUser);

// ✅ ADD THESE USER ROUTES
router.post("/forgot-password", forgotUserPassword);
router.post("/verify-otp", verifyUserOtp);
router.put("/reset-password", resetUserPassword);

// ---------- ADMIN ----------
router.post("/admin/login", adminLogin);
router.post("/admin/forgot-password", forgotAdminPassword);
router.put("/admin/reset-password/:token", resetAdminPassword);

// ---------- ADMIN PROTECTED ----------
router.post("/admin/register", adminProtect, registerAdmin);
router.get("/admin/users", adminProtect, getAllUsers);

export default router;
