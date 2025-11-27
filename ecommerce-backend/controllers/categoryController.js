// backend/controllers/categoryController.js
import Category from "../models/categoryModel.js";

// ✅ Fetch all categories for customers (read-only)
export const getPublicCategories = async (req, res) => {
  try {
    const categories = await Category.find().select("name image"); // Only show name & image
    res.json(categories);
  } catch (error) {
    console.error("❌ Error fetching categories:", error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};
