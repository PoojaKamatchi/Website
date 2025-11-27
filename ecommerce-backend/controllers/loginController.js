import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1️⃣ Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // 2️⃣ Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // 3️⃣ Respond with token and user info
    res.status(200).json({
      token: generateToken(user._id),
      _id: user._id, // ✅ Add this line
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || "",
      profilePic: user.profilePic || "",
      address: user.address || {},
      location: user.location || {},
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};
