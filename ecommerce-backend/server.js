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

// ✅ Load environment variables FIRST
dotenv.config();

// ✅ Connect to MongoDB
connectDB();

// ✅ Import all routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import adminProductRoutes from "./routes/adminProductRoutes.js";
import adminCategoryRoutes from "./routes/adminCategoryRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js"; // ✅ Customer Category Routes

const app = express();
const server = http.createServer(app);

// ✅ Define allowed origins for both admin & customer
const allowedOrigins = [
  "http://localhost:5173", // Customer Frontend
  "http://localhost:5174",
  "https://website-tjd8-3womia9iv-poojakamatchis-projects.vercel.app" // Admin Panel
];

// ✅ CORS setup (for cross-origin requests)
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`🚫 CORS blocked: ${origin}`);
        callback(new Error("CORS policy blocked this origin"));
      }
    },
    credentials: true,
  })
);

// ✅ Socket.IO setup (for real-time updates)
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});
app.set("socketio", io);

// ✅ Built-in Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Serve static uploads folder (for images)
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Root route (check API is live)
app.get("/", (req, res) => {
  res.send("✅ API is running successfully...");
});

// ✅ API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// 🟢 CHANGED HERE — this allows /api/auth/admin/login
app.use("/api/auth", adminRoutes);

app.use("/api/auth/admin/products", adminProductRoutes);
app.use("/api/auth/admin/category", adminCategoryRoutes);

app.use("/api/categories", categoryRoutes); // ✅ Customer routes
app.use("/api/wishlist", wishlistRoutes);

// ✅ Error Handling
app.use(notFound);
app.use(errorHandler);

// ✅ Socket Events
io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
