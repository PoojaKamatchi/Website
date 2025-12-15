import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/userModel.js";
import Admin from "../models/adminModel.js";
import sendEmail from "../utils/sendEmail.js";

// ==========================
// JWT GENERATOR
// ==========================
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// ==========================
// USER REGISTER
// ==========================
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, mobile });

    res.status(201).json({
      message: "User registered",
      token: generateToken(user._id),
      user,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: "Register failed" });
  }
};

// ==========================
// USER LOGIN
// ==========================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    res.json({
      message: "Login successful",
      token: generateToken(user._id),
      user,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Login failed" });
  }
};

// ==========================
// USER FORGOT PASSWORD (OTP)
// ==========================
export const forgotUserPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.resetOtpExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    // SEND OTP EMAIL
    await sendEmail({
      to: user.email,
      subject: "Password Reset OTP",
      html: `
        <h2>Password Reset OTP</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>Valid for 10 minutes</p>
      `,
    });

    res.json({ message: "OTP sent successfully", userId: user._id });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    res.status(500).json({ message: "OTP send failed" });
  }
};

// ==========================
// VERIFY USER OTP
// ==========================
export const verifyUserOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    const user = await User.findById(userId);

    if (!user || user.resetOtp !== otp || user.resetOtpExpire < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    res.json({ message: "OTP verified", token: generateToken(user._id) });
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    res.status(500).json({ message: "OTP verification failed" });
  }
};

// ==========================
// RESET USER PASSWORD
// ==========================
export const resetUserPassword = async (req, res) => {
  try {
    const { userId, otp, newPassword } = req.body;
    const user = await User.findById(userId);

    if (!user || user.resetOtp !== otp || user.resetOtpExpire < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOtp = undefined;
    user.resetOtpExpire = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    res.status(500).json({ message: "Password reset failed" });
  }
};

// ==========================
// ADMIN LOGIN
// ==========================
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    res.json({
      message: "Admin login successful",
      token: generateToken(admin._id),
      admin: { id: admin._id, name: admin.name, email: admin.email },
    });
  } catch (error) {
    console.error("ADMIN LOGIN ERROR:", error);
    res.status(500).json({ message: "Admin login failed" });
  }
};

// ==========================
// ADMIN FORGOT PASSWORD
// ==========================
export const forgotAdminPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const resetToken = crypto.randomBytes(20).toString("hex");
    const hashed = crypto.createHash("sha256").update(resetToken).digest("hex");

    admin.resetPasswordToken = hashed;
    admin.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    await admin.save();

    const resetUrl = `${process.env.FRONTEND_URL}/admin/reset-password/${resetToken}`;
    await sendEmail({
      to: admin.email,
      subject: "Admin Password Reset",
      html: `<a href="${resetUrl}">${resetUrl}</a>`,
    });

    res.json({ message: "Reset link sent" });
  } catch (error) {
    console.error("ADMIN FORGOT PASSWORD ERROR:", error);
    res.status(500).json({ message: "Reset email failed" });
  }
};

// ==========================
// RESET ADMIN PASSWORD
// ==========================
export const resetAdminPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashed = crypto.createHash("sha256").update(token).digest("hex");
    const admin = await Admin.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!admin) return res.status(400).json({ message: "Invalid token" });

    admin.password = await bcrypt.hash(password, 10);
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpire = undefined;
    await admin.save();

    res.json({ message: "Password reset success" });
  } catch (error) {
    console.error("RESET ADMIN PASSWORD ERROR:", error);
    res.status(500).json({ message: "Reset failed" });
  }
};

// ==========================
// REGISTER NEW ADMIN (ADMIN ONLY)
// ==========================
export const registerAdmin = async (req, res) => {
  try {
    if (!req.admin) return res.status(401).json({ message: "Admin only" });

    const { name, email, password } = req.body;
    const exists = await Admin.findOne({ email });
    if (exists) return res.status(400).json({ message: "Admin exists" });

    const hashed = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ name, email, password: hashed });

    res.status(201).json({ message: "Admin created", admin });
  } catch (error) {
    console.error("REGISTER ADMIN ERROR:", error);
    res.status(500).json({ message: "Admin create failed" });
  }
};

// ==========================
// GET ALL USERS (ADMIN ONLY)
// ==========================
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error("GET USERS ERROR:", error);
    res.status(500).json({ message: "Fetch users failed" });
  }
};
