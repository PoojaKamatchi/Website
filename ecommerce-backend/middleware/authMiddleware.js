import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Admin from "../models/adminModel.js";

/* ===================== USER PROTECT ===================== */
export const protect = async (req, res, next) => {
  let token;
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = user;
      next();
    } else {
      return res.status(401).json({ message: "Not authorized, no token" });
    }
  } catch (error) {
    console.error("User Auth Error:", error.message);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};



/* ===================== ADMIN PROTECT ===================== */

// ✅ Admin authentication middleware
export const adminProtect = async (req, res, next) => {
  let token;
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const admin = await Admin.findById(decoded.id).select("-password");
      if (!admin) {
        return res.status(401).json({ message: "Admin not found" });
      }

      req.admin = admin;
      next();
    } else {
      return res.status(401).json({ message: "Not authorized, no token" });
    }
  } catch (error) {
    console.error("Admin Auth Error:", error.message);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};


/* ===================== OPTIONAL: ROLE CHECK ===================== */
// Use in routes if you want to allow only admin
export const authorizeRoles = (...roles) => (req, res, next) => {
  if (roles.includes(req.admin?.role)) {
    return next();
  }
  return res.status(403).json({ message: "Forbidden: insufficient role" });
};
