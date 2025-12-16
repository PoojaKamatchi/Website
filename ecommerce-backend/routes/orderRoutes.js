import express from "express";
import {
  createOrder,
  getUserOrders,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
} from "../controllers/orderController.js";
import { protect, adminProtect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= USER ROUTES ================= */
router.post("/create", protect, createOrder);
router.get("/user", protect, getUserOrders);
router.put("/:id/cancel", protect, cancelOrder);

/* ================= ADMIN ROUTES ================= */
router.get("/all", adminProtect, getAllOrders);
router.put("/status/:id", adminProtect, updateOrderStatus);
router.put("/payment/:id", adminProtect, updatePaymentStatus);

export default router;
