import Category from "../models/categoryModel.js";
import path from "path";
import fs from "fs";

// ✅ Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};

// ✅ Add new category
export const addCategory = async (req, res) => {
  try {
    let { name, imageUrl } = req.body;

    if (!name) return res.status(400).json({ message: "Category name is required" });
    if (typeof name === "string") name = JSON.parse(name);

    if (!name.en || !name.ta) {
      return res.status(400).json({ message: "Both English and Tamil names are required" });
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : imageUrl || "";

    const category = new Category({
      name,
      image: imagePath,
    });

    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: "Failed to add category", error: error.message });
  }
};

// ✅ Update category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    let { name, imageUrl } = req.body;

    if (name && typeof name === "string") name = JSON.parse(name);

    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    // Update name
    if (name) {
      if (name.en) category.name.en = name.en;
      if (name.ta) category.name.ta = name.ta;
    }

    // Update image
    if (req.file) {
      // Delete old image if exists
      if (category.image && category.image.startsWith("/uploads/")) {
        const oldPath = path.join(process.cwd(), category.image.replace(/^\//, ""));
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      category.image = `/uploads/${req.file.filename}`;
    } else if (imageUrl) {
      category.image = imageUrl;
    }

    const updated = await category.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update category", error: error.message });
  }
};

// ✅ Delete category
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    // Delete image from uploads
    if (category.image && category.image.startsWith("/uploads/")) {
      const imgPath = path.join(process.cwd(), category.image.replace(/^\//, ""));
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete category", error: error.message });
  }
};
