import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

// REGISTER USER
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      userId: user._id, // for OTP flow
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN USER
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET USER PROFILE
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    console.error("Profile Error:", error);
    res.status(500).json({ message: "Error fetching user profile" });
  }
};

// UPDATE USER PROFILE
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, phone, profilePic, password } = req.body;
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (profilePic) user.profilePic = profilePic;
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();
    res.json({ message: "Profile updated", user });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: "Error updating profile" });
  }
};

// UPDATE USER ADDRESS
export const updateUserAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.address = req.body.address || user.address;
    user.location = req.body.location || user.location;
    await user.save();

    res.json({
      message: "Address updated successfully",
      address: user.address,
      location: user.location,
    });
  } catch (error) {
    console.error("Address Update Error:", error);
    res.status(500).json({ message: "Error updating address" });
  }
};

// FORGOT PASSWORD (SEND OTP)
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate OTP and save it temporarily (example: 6-digit)
    const otp = Math.floor(100000 + Math.random() * 900000);
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    console.log(`OTP for ${email}: ${otp}`); // For testing; replace with email service
    res.json({ message: "OTP sent", userId: user._id });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// VERIFY OTP
export const verifyOtp = async (req, res) => {
  const { userId, otp } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp != otp || Date.now() > user.otpExpires)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({ message: "OTP verified", token: generateToken(user._id) });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
  const { userId, otp, newPassword } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp != otp || Date.now() > user.otpExpires)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
