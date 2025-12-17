import express from "express";
import {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
} from "../controllers/orderController.js";

import upload from "../middleware/upload.js";
import { protect, adminProtect } from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/", protect, upload.single("paymentScreenshot"), createOrder);
router.get("/user", protect, getUserOrders);
router.get("/all", protect, adminProtect, getAllOrders);
router.put("/status/:id", protect, adminProtect, updateOrderStatus);
router.put("/payment/:id", protect, adminProtect, updatePaymentStatus)
export default router;
