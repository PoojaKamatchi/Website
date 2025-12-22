import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

/* ================= EMAIL ================= */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOtp = async (email, otp, title) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: title,
    text: `Your OTP is ${otp}. Valid for 10 minutes.`,
  });
};

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

/* ================= REGISTER SEND OTP ================= */
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields required" });

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email already exists" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const user = await User.create({
    name,
    email,
    password,
    registerOtp: otp,
    registerOtpExpire: Date.now() + 10 * 60 * 1000,
  });

  await sendOtp(email, otp, "Verify Your Account");

  res.json({ userId: user._id });
};

/* ================= VERIFY REGISTER OTP ================= */
export const verifyRegisterOtp = async (req, res) => {
  const { userId, otp } = req.body;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (
    user.registerOtp !== otp ||
    Date.now() > user.registerOtpExpire
  )
    return res.status(400).json({ message: "Invalid or expired OTP" });

  user.isVerified = true;
  user.registerOtp = null;
  user.registerOtpExpire = null;
  await user.save();

  res.json({ message: "Registration verified" });
};

/* ================= LOGIN ================= */
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  if (!user.isVerified)
    return res.status(401).json({ message: "Verify email first" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: "Invalid credentials" });

  res.json({
    token: generateToken(user._id),
    user: { name: user.name, email: user.email },
  });
};

/* ================= FORGOT PASSWORD ================= */
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  user.resetOtp = otp;
  user.resetOtpExpire = Date.now() + 10 * 60 * 1000;
  await user.save();

  await sendOtp(email, otp, "Reset Password OTP");

  res.json({ userId: user._id });
};

/* ================= VERIFY RESET OTP ================= */
export const verifyOtp = async (req, res) => {
  const { userId, otp } = req.body;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.resetOtp !== otp || Date.now() > user.resetOtpExpire)
    return res.status(400).json({ message: "Invalid or expired OTP" });

  res.json({ message: "OTP verified" });
};

/* ================= RESET PASSWORD ================= */
export const resetPassword = async (req, res) => {
  const { userId, otp, newPassword } = req.body;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.resetOtp !== otp || Date.now() > user.resetOtpExpire)
    return res.status(400).json({ message: "Invalid or expired OTP" });

  user.password = newPassword;
  user.resetOtp = null;
  user.resetOtpExpire = null;
  await user.save();

  res.json({ message: "Password reset successful" });
};
