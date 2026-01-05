// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import http from "http";
import { fileURLToPath } from "url";

// DB & Middleware
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import adminProductRoutes from "./routes/adminProductRoutes.js";
import adminCategoryRoutes from "./routes/adminCategoryRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import offerRoutes from "./routes/offerRoutes.js";

/* ================= ENV & DB ================= */
dotenv.config();
connectDB();

/* ================= APP ================= */
const app = express();
const server = http.createServer(app);

/* ================= CORS ================= */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://lifegain-in.onrender.com",
  "https://adminpanel-7pn1.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ================= Middleware ================= */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ================= __dirname for ES Modules ================= */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ================= Static ================= */
// Uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ================= API Routes ================= */
app.use("/api/auth", authRoutes);                     // user auth
app.use("/api/admin", adminRoutes);                   // admin auth/dashboard
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/admin/products", adminProductRoutes);
app.use("/api/admin/categories", adminCategoryRoutes);

/* ================= FRONTEND SERVE ================= */
const frontendPath = path.join(__dirname, "frontend", "build");

if (process.env.NODE_ENV === "production") {
  app.use(express.static(frontendPath));

  // Serve only index.html explicitly (React app)  
  app.get("/", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
  app.get("/about", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
  app.get("/contact", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
  // Add other frontend paths manually if needed
} else {
  app.get("/", (req, res) => {
    res.send("API running...");
  });
}

/* ================= Error Handling ================= */
app.use(notFound);
app.use(errorHandler);

/* ================= Server ================= */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
