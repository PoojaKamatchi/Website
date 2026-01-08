import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import sendEmail from "../utils/sendEmail.js";

/* ================= JWT TOKEN ================= */
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

/* ================= REGISTER USER ================= */
export const registerUser = async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const email = req.body.email?.toLowerCase().trim();
    const password = req.body.password;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    let user = await User.findOne({ email });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    if (user) {
      // ❌ already verified user
      if (user.isVerified) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // 🔁 resend OTP for unverified user
      user.registerOtp = otp;
      user.registerOtpExpire = Date.now() + 10 * 60 * 1000;
      await user.save();
    } else {
      // ✅ create new user
      user = new User({
        name,
        email,
        password,
        registerOtp: otp,
        registerOtpExpire: Date.now() + 10 * 60 * 1000,
        isVerified: false,
      });

      await user.save();
    }

    // 📧 send OTP (do not break API if mail fails)
    const emailSent = await sendEmail({
      to: email,
      subject: "Verify Your Account - Life Gain",
      otp,
      userName: user.name,
    });

    if (!emailSent) {
      console.log("⚠️ OTP email not sent, but user saved");
    }

    res.status(200).json({
      userId: user._id,
      message: "OTP sent successfully",
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= VERIFY REGISTER OTP ================= */
export const verifyRegisterOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (
      user.registerOtp !== otp ||
      !user.registerOtpExpire ||
      Date.now() > user.registerOtpExpire
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.registerOtp = null;
    user.registerOtpExpire = null;
    await user.save();

    res.status(200).json({
      message: "Registration verified successfully",
      token: generateToken(user._id),
      user: { name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= LOGIN USER ================= */
export const loginUser = async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase().trim();
    const password = req.body.password;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.isVerified) {
      return res.status(401).json({ message: "Please verify your email first" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      token: generateToken(user._id),
      user: { name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= FORGOT PASSWORD ================= */
export const forgotPassword = async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase().trim();
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.resetOtpExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendEmail({
      to: email,
      subject: "Password Reset OTP - Life Gain",
      otp,
      userName: user.name,
    });

    res.status(200).json({
      userId: user._id,
      message: "OTP sent successfully",
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= VERIFY RESET OTP ================= */
export const verifyOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (
      user.resetOtp !== otp ||
      !user.resetOtpExpire ||
      Date.now() > user.resetOtpExpire
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error("Verify reset OTP error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= RESET PASSWORD ================= */
export const resetPassword = async (req, res) => {
  try {
    const { userId, otp, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (
      user.resetOtp !== otp ||
      !user.resetOtpExpire ||
      Date.now() > user.resetOtpExpire
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    user.resetOtp = null;
    user.resetOtpExpire = null;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
