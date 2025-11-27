// routes/cartRoutes.js
import express from "express";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from "../controllers/cartController.js";

import { protect } from "../middleware/authMiddleware.js"; // ✅ only use protect (not adminProtect)

const router = express.Router();

// ✅ Routes
router.post("/add", protect, addToCart); // Add item to cart
router.get("/", protect, getCart); // Get all items in cart
router.put("/update", protect, updateCartItem); // Update item quantity
router.delete("/remove/:productId", protect, removeFromCart); // Remove item
router.delete("/clear", protect, clearCart); // Clear cart

export default router;
