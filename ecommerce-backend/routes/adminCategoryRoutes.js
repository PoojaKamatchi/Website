import express from "express";
import upload from "../middleware/uploadCategory.js"; // your multer middleware
import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/adminCategoryController.js";

const router = express.Router();

// ✅ Get all categories
router.get("/", getCategories);

// ✅ Add new category (with image)
router.post("/", upload.single("image"), addCategory);

// ✅ Update category (replace old image if new one uploaded)
router.put("/:id", upload.single("image"), updateCategory);

// ✅ Delete category
router.delete("/:id", deleteCategory);

export default router;
