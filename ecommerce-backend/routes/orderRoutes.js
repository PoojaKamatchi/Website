import express from "express";
import { protect, adminProtect } from "../middleware/authMiddleware.js";
import { createOrder, getUserOrders, cancelOrder, getAllOrders, updateOrderStatus } from "../controllers/orderController.js";

const router = express.Router();

// User
router.post("/create", protect, createOrder);
router.get("/user", protect, getUserOrders);
router.put("/:id/cancel", protect, cancelOrder);

// Admin
router.get("/all", adminProtect, getAllOrders);
router.put("/status/:id", adminProtect, updateOrderStatus);

export default router;
