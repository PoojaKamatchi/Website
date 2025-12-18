import express from "express";
import { protect, adminProtect } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
import {
  createOrder,
  getUserOrders,
  cancelOrderByUser,
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
} from "../controllers/orderController.js";

const router = express.Router();

router.post(
  "/create",
  protect,
  upload.single("paymentScreenshot"),
  createOrder
);

router.get("/user", protect, getUserOrders);
router.put("/:id/cancel", protect, cancelOrderByUser);

router.get("/all", adminProtect, getAllOrders);
router.put("/status/:id", adminProtect, updateOrderStatus);
router.put("/payment/:id", adminProtect, updatePaymentStatus);

export default router;
