import express from "express";
import {
  registerUser,
  loginUser,
  adminLogin,
  forgotAdminPassword,
  resetAdminPassword,
  registerAdmin,
  getAllUsers,
} from "../controllers/authController.js";
import { protect, adminProtect } from "../middleware/authMiddleware.js";

const router = express.Router();

// user
router.post("/register", registerUser);
router.post("/login", loginUser);

// admin
router.post("/admin/login", adminLogin);
router.post("/admin/forgot-password", forgotAdminPassword);
router.put("/admin/reset-password/:token", resetAdminPassword);

// admin protected
router.post("/admin/register", adminProtect, registerAdmin);
router.get("/admin/users", adminProtect, getAllUsers);

export default router;
