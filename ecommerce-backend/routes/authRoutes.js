import express from "express";
import {
  adminLogin,
  registerAdmin,
  getAllUsers,
} from "../controllers/authController.js";
import { adminProtect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ---------- ADMIN LOGIN ----------
router.post("/login", adminLogin);

// ---------- ADMIN PROTECTED ----------
router.post("/register", adminProtect, registerAdmin);
router.get("/users", adminProtect, getAllUsers);

export default router;
