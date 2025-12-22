import express from "express";
import upload from "../middleware/upload.js";
import { protect, adminProtect } from "../middleware/authMiddleware.js";
import {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder,
} from "../controllers/orderController.js";

const router = express.Router();

/* ================= ADMIN (FIRST) ================= */
router.get("/all", adminProtect, getAllOrders);
router.put("/status/:id", adminProtect, updateOrderStatus);
router.put("/payment/:id", adminProtect, updatePaymentStatus);

/* ================= USER ================= */
router.post("/create", protect, upload.single("paymentScreenshot"), createOrder);
router.get("/user", protect, getUserOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/cancel", protect, cancelOrder);

export default router;
