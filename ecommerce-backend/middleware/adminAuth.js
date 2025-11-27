import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";

const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided, access denied" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(403).json({ message: "Access denied, admin not found" });
    }

    req.user = {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: "admin",
    };

    next();
  } catch (error) {
    console.error("Admin Auth Error:", error.message);
    res.status(401).json({ message: "Not authorized, invalid or expired token" });
  }
};

export default adminAuth;
