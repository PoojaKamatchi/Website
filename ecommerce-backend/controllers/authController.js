import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/userModel.js";
import Admin from "../models/adminModel.js";
import sendEmail from "../utils/sendEmail.js";

// Generate JWT
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

// ==========================
// USER AUTH (unchanged)
// ==========================
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, mobile });

    res.status(201).json({
      message: "User registered successfully",
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to register user" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    res.json({ message: "Login successful", token: generateToken(user._id), user });
  } catch (err) {
    res.status(500).json({ message: "Failed to login" });
  }
};

// ==========================
// ADMIN LOGIN (Request OTP)
// ==========================
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    admin.otp = otp;
    admin.otpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await admin.save();

    const message = `
      <h3>OTP for Admin Login</h3>
      <p>Your OTP is: <b>${otp}</b></p>
      <p>It will expire in 10 minutes.</p>
    `;
    await sendEmail({ to: admin.email, subject: "Admin OTP", html: message });

    res.json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// ==========================
// VERIFY OTP & LOGIN
// ==========================
export const verifyAdminOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) return res.status(404).json({ message: "Admin not found" });
    if (!admin.otp || !admin.otpExpire) return res.status(400).json({ message: "No OTP requested" });

    if (admin.otp !== otp || admin.otpExpire < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    admin.otp = undefined;
    admin.otpExpire = undefined;
    await admin.save();

    res.json({ message: "Login successful", token: generateToken(admin._id), admin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "OTP verification failed" });
  }
};

// ==========================
// ADMIN PASSWORD RESET
// ==========================
export const forgotAdminPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const resetToken = crypto.randomBytes(20).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    admin.resetPasswordToken = hashedToken;
    admin.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    await admin.save();

    const resetUrl = `${process.env.FRONTEND_URL}/admin/reset-password/${resetToken}`;
    const message = `
      <h3>Password Reset Request</h3>
      <p>Click below link to reset:</p>
      <a href="${resetUrl}" target="_blank">${resetUrl}</a>
      <p>This link will expire in 10 minutes.</p>
    `;
    await sendEmail({ to: admin.email, subject: "Admin Password Reset", html: message });

    res.json({ message: "Password reset link sent to your email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending reset email" });
  }
};

export const resetAdminPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const admin = await Admin.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!admin) return res.status(400).json({ message: "Invalid or expired token" });

    admin.password = await bcrypt.hash(password, 10);
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpire = undefined;
    await admin.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during password reset" });
  }
};

// ==========================
// REGISTER NEW ADMIN (only by logged-in admin)
// ==========================
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Only allow if logged-in admin
    if (!req.admin) {
      return res.status(401).json({ message: "Not authorized. Only admin can add another admin." });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) return res.status(400).json({ message: "Admin already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await Admin.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: "New admin registered successfully", admin: newAdmin });
  } catch (err) {
    console.error("Admin Register Error:", err.message);
    res.status(500).json({ message: "Failed to register admin" });
  }
};

// ==========================
// GET ALL USERS (Admin Only)
// ==========================
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};
