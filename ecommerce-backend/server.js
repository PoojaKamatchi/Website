// ================= IMPORTS =================
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import http from "http";

import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import adminProductRoutes from "./routes/adminProductRoutes.js";
import adminCategoryRoutes from "./routes/adminCategoryRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import offerRoutes from "./routes/offerRoutes.js";

// ================= CONFIG =================
dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// ================= CORS =================

// Only deployed frontend + admin
const FRONTEND_URL =
  process.env.FRONTEND_URL || "https://lifegain-in.onrender.com";

const ADMIN_URL =
  process.env.ADMIN_URL || "https://adminpanel-7pn1.onrender.com";

const allowedOrigins = [FRONTEND_URL, ADMIN_URL];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow server-to-server / Postman

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS policy: The origin ${origin} is not allowed`),
        false
      );
    },
    credentials: true,
  })
);

// ================= MIDDLEWARE =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ================= STATIC UPLOADS =================
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================= API ROUTES =================

// Auth
app.use("/api/auth", authRoutes);
app.use("/api/auth", adminRoutes);

// Users
app.use("/api/users", userRoutes);
app.use("/api/users", profileRoutes);

// Ecommerce
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/offers", offerRoutes);

// Contact
app.use("/api", contactRoutes);

// Admin
app.use("/api/auth/admin/products", adminProductRoutes);
app.use("/api/auth/admin/category", adminCategoryRoutes);

// ================= FRONTEND SERVE =================
const frontendPath = path.join(__dirname, "frontend", "dist");
app.use(express.static(frontendPath));

// React Router Fix
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ================= ERROR HANDLING =================
app.use(notFound);
app.use(errorHandler);

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
