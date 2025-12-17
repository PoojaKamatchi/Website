import express from "express";
import {
  createOrder,
  getUserOrders,
  cancelOrder
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// User routes
router.post("/create", protect, upload.single("paymentScreenshot"), createOrder);
router.get("/user", protect, getUserOrders);
router.put("/:id/cancel", protect, cancelOrder);

export default router;
