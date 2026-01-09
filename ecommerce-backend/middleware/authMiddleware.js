import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Admin from "../models/adminModel.js";

/* ===================== USER PROTECT ===================== */
export const protect = async (req, res, next) => {
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      const token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = user;
      return next();
    }

    return res.status(401).json({ message: "Not authorized, no token" });
  } catch (error) {
    console.error("User Auth Error:", error.message);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

/* ===================== ADMIN PROTECT ===================== */
export const adminProtect = async (req, res, next) => {
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      const token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const admin = await Admin.findById(decoded.id).select("-password");
      if (!admin) {
        return res.status(401).json({ message: "Admin not found" });
      }

      req.admin = admin;
      return next();
    }

    return res.status(401).json({ message: "Not authorized, no token" });
  } catch (error) {
    console.error("Admin Auth Error:", error.message);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

/* ===================== ROLE CHECK ===================== */
// Safe even if role does not exist
export const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.admin) {
    return res.status(401).json({ message: "Admin not authenticated" });
  }

  if (!req.admin.role) {
    return res.status(403).json({ message: "Role not assigned" });
  }

  if (roles.includes(req.admin.role)) {
    return next();
  }

  return res.status(403).json({ message: "Forbidden: insufficient role" });
};
