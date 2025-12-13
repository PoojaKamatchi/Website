import express from "express";
import {
  getProducts,
  getProductsByCategory,
  getProductById,
  searchProducts,
} from "../controllers/productController.js";

const router = express.Router();

// 🛒 Public routes for customers
router.get("/", getProducts);
router.get("/category/:id", getProductsByCategory);

// 🔍 Search route — must be BEFORE :id
router.get("/search", searchProducts);

router.get("/:id", getProductById);

export default router;
