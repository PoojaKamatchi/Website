import express from "express";
import {
  registerUser,
  verifyRegisterOtp,
  loginUser,
  forgotPassword,
  verifyOtp,
  resetPassword,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register-otp", registerUser);
router.post("/verify-register-otp", verifyRegisterOtp);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.put("/reset-password", resetPassword);

export default router;
