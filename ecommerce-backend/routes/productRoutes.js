import express from "express";
import {
  getProducts,
  getProductsByCategory,
  getProductById,
  searchProducts, // ✅ add this
} from "../controllers/productController.js";

const router = express.Router();

// 🛒 Public routes for customers
router.get("/", getProducts);
router.get("/category/:id", getProductsByCategory);
router.get("/:id", getProductById);

// 🔍 Search route
router.get("/search", searchProducts);

export default router;
