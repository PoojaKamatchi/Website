import express from "express";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/adminProductController.js";
import adminAuth from "../middleware/adminAuth.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// 🧾 Admin Product Management
router.get("/", adminAuth, getAllProducts);
router.post("/", adminAuth, upload.single("image"), createProduct);
router.put("/:id", adminAuth, upload.single("image"), updateProduct);
router.delete("/:id", adminAuth, deleteProduct);

export default router;
