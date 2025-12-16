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
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

// ==========================
// USER CONTROLLERS
// ==========================

// REGISTER USER (send OTP)
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      resetOtp: otp,
      resetOtpExpire: Date.now() + 10 * 60 * 1000, // 10 minutes
    });

    console.log(`Registration OTP for ${email}: ${otp}`); // for testing

    await sendEmail({
      to: email,
      subject: "OTP for Registration",
      html: `<h2>Your OTP is ${otp}</h2><p>Valid for 10 minutes</p>`,
    });

    res.status(201).json({ userId: user._id, message: "OTP sent to email" });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: "Register failed" });
  }
};

// VERIFY REGISTER OTP
export const verifyRegisterOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.resetOtp !== otp || Date.now() > user.resetOtpExpire)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    user.resetOtp = null;
    user.resetOtpExpire = null;
    await user.save();

    res.json({ message: "Registration verified successfully" });
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    res.status(500).json({ message: "OTP verification failed" });
  }
};

// LOGIN USER
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
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Login failed" });
  }
};

// FORGOT PASSWORD (send OTP)
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.resetOtpExpire = Date.now() + 10 * 60 * 1000; // 10 min
    await user.save();

    console.log(`Password reset OTP for ${email}: ${otp}`); // testing

    await sendEmail({
      to: email,
      subject: "Password Reset OTP",
      html: `<h2>Your OTP is ${otp}</h2><p>Valid for 10 minutes</p>`,
    });

    res.json({ message: "OTP sent", userId: user._id });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    res.status(500).json({ message: "OTP send failed" });
  }
};

// VERIFY OTP FOR PASSWORD RESET
export const verifyOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.resetOtp !== otp || Date.now() > user.resetOtpExpire)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    res.json({ message: "OTP verified" });
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    res.status(500).json({ message: "OTP verification failed" });
  }
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { userId, otp, newPassword } = req.body;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.resetOtp !== otp || Date.now() > user.resetOtpExpire)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOtp = null;
    user.resetOtpExpire = null;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    res.status(500).json({ message: "Password reset failed" });
  }
};

// GET USER PROFILE
export const getProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("-password -resetOtp -resetOtpExpire");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);
    res.status(500).json({ message: "Profile fetch failed" });
  }
};

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
    admin.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
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
