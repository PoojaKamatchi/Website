// =========================
// ✅ server.js
// =========================

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";

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

// =========================
// ✅ ENV + DB
// =========================
dotenv.config();
connectDB();

// =========================
// ✅ APP SETUP
// =========================
const app = express();
const server = http.createServer(app);

// =========================
// ✅ CORS CONFIG (FIXED)
// =========================
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow Postman, curl, mobile apps
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:5174",
        "https://vite-project-awha.onrender.com",
       " https://adminpanel-7pn1.onrender.com/admin/login"

      ];

      // Allow Render frontend domains
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".onrender.com")
      ) {
        return callback(null, true);
      }

      console.log("🚫 CORS blocked:", origin);
      return callback(null, false); // ❗ DO NOT throw error
    },
    credentials: true,
  })
);

// =========================
// ✅ SOCKET.IO
// =========================
const io = new Server(server, {
  cors: {
    origin: true,
    credentials: true,
  },
});
app.set("socketio", io);

// =========================
// ✅ MIDDLEWARES
// =========================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// =========================
// ✅ STATIC FILES
// =========================
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// =========================
// ✅ ROOT TEST
// =========================
app.get("/", (req, res) => {
  res.send("✅ API is running successfully...");
});

// =========================
// ✅ ROUTES
// =========================

// Auth
app.use("/api/auth", authRoutes);
app.use("/api/auth", adminRoutes);

// Users & Products
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);

// Cart & Orders
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// Admin
app.use("/api/auth/admin/products", adminProductRoutes);
app.use("/api/auth/admin/category", adminCategoryRoutes);

// Customer
app.use("/api/categories", categoryRoutes);
app.use("/api/wishlist", wishlistRoutes);

// Others
app.use("/api", contactRoutes);
app.use("/api/offers", offerRoutes);

// =========================
// ✅ ERROR HANDLING
// =========================
app.use(notFound);
app.use(errorHandler);

// =========================
// ✅ SOCKET EVENTS
// =========================
io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// =========================
// ✅ START SERVER
// =========================
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
