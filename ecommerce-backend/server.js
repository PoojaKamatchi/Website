// server.js
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
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import adminProductRoutes from "./routes/adminProductRoutes.js";
import adminCategoryRoutes from "./routes/adminCategoryRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import offerRoutes from "./routes/offerRoutes.js";

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

/* ================= CORS (ADMIN + USER) ================= */
const allowedOrigins = [
  "https://lifegain-in.onrender.com",      // User
  "https://adminpanel-7pn1.onrender.com"    // Admin
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Postman / server
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);

/* ================= Middleware ================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ================= Static ================= */
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ================= API Routes ================= */
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/offers", offerRoutes);

app.use("/api/admin/products", adminProductRoutes);
app.use("/api/admin/category", adminCategoryRoutes);

/* ================= FRONTEND SERVE (optional) ================= */
// ⚠️ Use this ONLY if backend hosts frontend
// Otherwise REMOVE this entire block in Render

const frontendPath = path.join(__dirname, "frontend", "dist");
app.use(express.static(frontendPath));

app.use((req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

/* ================= Errors ================= */
app.use(notFound);
app.use(errorHandler);

/* ================= Server ================= */
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
