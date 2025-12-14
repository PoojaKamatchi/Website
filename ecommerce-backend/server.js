// ✅ server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

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

/* =====================================================
   ✅ SIMPLE & WORKING CORS (FINAL)
===================================================== */

app.use(
  cors({
    origin: true,        // ✅ allow all origins dynamically
    credentials: true,   // ✅ allow cookies / auth
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ IMPORTANT: handle preflight
app.options("*", cors());

/* =====================================================
   ✅ SOCKET.IO
===================================================== */
const io = new Server(server, {
  cors: {
    origin: true,
    credentials: true,
  },
});
app.set("socketio", io);

/* =====================================================
   ✅ MIDDLEWARES
===================================================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* =====================================================
   ✅ STATIC FILES
===================================================== */
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* =====================================================
   ✅ ROUTES
===================================================== */
app.get("/", (req, res) => {
  res.send("✅ API is running successfully...");
});

app.use("/api/auth", authRoutes);
app.use("/api/auth", adminRoutes);

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.use("/api/auth/admin/products", adminProductRoutes);
app.use("/api/auth/admin/category", adminCategoryRoutes);

app.use("/api/categories", categoryRoutes);
app.use("/api/wishlist", wishlistRoutes);

app.use("/api", contactRoutes);
app.use("/api/offers", offerRoutes);

/* =====================================================
   ✅ ERRORS
===================================================== */
app.use(notFound);
app.use(errorHandler);

/* =====================================================
   ✅ SERVER
===================================================== */
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
