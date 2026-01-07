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

/* ================= CORS ================= */
// Allow frontend domain (replace with your frontend URL)
const FRONTEND_URL = process.env.FRONTEND_URL || "https://lifegain-in.onrender.com";

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true, // Allow cookies/auth headers
  })
);

/* ================= Middleware ================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ================= Static Uploads ================= */
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ================= API Routes ================= */
app.use("/api/auth", authRoutes);
app.use("/api/auth", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api", contactRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/auth/admin/products", adminProductRoutes);
app.use("/api/auth/admin/category", adminCategoryRoutes);

/* ================= FRONTEND SERVE ================= */
const frontendPath = path.join(__dirname, "frontend", "dist");
app.use(express.static(frontendPath));

// Fix React Router reload
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(path.join(frontendPath, "index.html"));
});

/* ================= Error Handling ================= */
app.use(notFound);
app.use(errorHandler);

/* ================= Start Server ================= */
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
