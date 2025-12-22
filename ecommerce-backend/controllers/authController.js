import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import Admin from "../models/adminModel.js";
import User from "../models/userModel.js";
import sendEmail from "../utils/sendEmail.js";

// ==========================
// JWT GENERATOR
// ==========================
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

// ==========================
// ADMIN CONTROLLERS
// ==========================

// LOGIN ADMIN
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

// FORGOT ADMIN PASSWORD
export const forgotAdminPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const token = crypto.randomBytes(20).toString("hex");
    const hashed = crypto.createHash("sha256").update(token).digest("hex");

    admin.resetPasswordToken = hashed;
    admin.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await admin.save();

    const resetUrl = `${process.env.FRONTEND_URL}/admin/reset-password/${token}`;
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

// RESET ADMIN PASSWORD
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

    res.json({ message: "Admin password reset successful" });
  } catch (error) {
    console.error("RESET ADMIN PASSWORD ERROR:", error);
    res.status(500).json({ message: "Reset failed" });
  }
};

// REGISTER NEW ADMIN (ADMIN ONLY)
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

// GET ALL USERS (ADMIN ONLY)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error("GET USERS ERROR:", error);
    res.status(500).json({ message: "Fetch users failed" });
  }
};
