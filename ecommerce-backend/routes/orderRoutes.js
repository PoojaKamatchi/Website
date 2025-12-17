import express from "express";
import {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrderByUser,
} from "../controllers/orderController.js";

import { protect, adminProtect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* USER */
router.post("/", protect, createOrder);
router.get("/my-orders", protect, getUserOrders);
router.put("/cancel/:id", protect, cancelOrderByUser);

/* ADMIN */
router.get("/all", adminProtect, getAllOrders);
router.put("/status/:id", adminProtect, updateOrderStatus);
router.put("/payment/:id", adminProtect, updatePaymentStatus);

export default router;
