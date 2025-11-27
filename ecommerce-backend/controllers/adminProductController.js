import Product from "../models/productModel.js";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";

// 🧾 Get all products (Admin)
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category", "name");
    const formatted = products.map((p) => ({
      ...p._doc,
      image: p.image?.startsWith("http")
        ? p.image
        : `${req.protocol}://${req.get("host")}${p.image}`,
    }));
    res.json(formatted);
  } catch (error) {
    console.error("🔥 Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// ➕ Create product (Admin)
export const createProduct = async (req, res) => {
  try {
    const { nameEn, nameTa, price, stock, description, category, imageUrl } = req.body;

    if (!nameEn || !price || !category)
      return res.status(400).json({ message: "Missing required fields" });

    if (!mongoose.Types.ObjectId.isValid(category))
      return res.status(400).json({ message: "Invalid category ID" });

    let imagePath = "";
    if (req.file) {
      // local file upload
      imagePath = `/uploads/${req.file.filename}`;
    } else if (imageUrl?.startsWith("http")) {
      // external URL
      imagePath = imageUrl;
    } else if (imageUrl) {
      // relative URL from uploads folder
      imagePath = `/uploads/${imageUrl}`;
    }

    const newProduct = new Product({
      name: { en: nameEn, ta: nameTa || "" },
      price,
      stock: stock || 0,
      description: description || "",
      category,
      image: imagePath,
    });

    const saved = await newProduct.save();

    const finalImage = saved.image?.startsWith("http")
      ? saved.image
      : `${req.protocol}://${req.get("host")}${saved.image}`;

    res.status(201).json({ ...saved._doc, image: finalImage });
  } catch (error) {
    console.error("🔥 Error creating product:", error);
    res.status(500).json({ message: "Failed to create product" });
  }
};

// ✏️ Update product (Admin)
export const updateProduct = async (req, res) => {
  try {
    const { nameEn, nameTa, price, stock, description, category, imageUrl } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.name.en = nameEn ?? product.name.en;
    product.name.ta = nameTa ?? product.name.ta;
    product.price = price ?? product.price;
    product.stock = stock ?? product.stock;
    product.description = description ?? product.description;

    if (category && mongoose.Types.ObjectId.isValid(category)) product.category = category;

    // Handle image update
    if (req.file) {
      // Delete old local file if exists
      if (product.image && !product.image.startsWith("http")) {
        const oldPath = path.join("uploads", path.basename(product.image));
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      product.image = `/uploads/${req.file.filename}`;
    } else if (imageUrl?.startsWith("http")) {
      product.image = imageUrl;
    } else if (imageUrl) {
      product.image = `/uploads/${imageUrl}`;
    }

    const updated = await product.save();

    const finalImage = updated.image?.startsWith("http")
      ? updated.image
      : `${req.protocol}://${req.get("host")}${updated.image}`;

    res.json({ ...updated._doc, image: finalImage });
  } catch (error) {
    console.error("🔥 Error updating product:", error);
    res.status(500).json({ message: "Failed to update product" });
  }
};

// 🗑️ Delete product (Admin)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.image && !product.image.startsWith("http")) {
      const imagePath = path.join("uploads", path.basename(product.image));
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await product.deleteOne();
    res.json({ message: "✅ Product deleted successfully" });
  } catch (error) {
    console.error("🔥 Error deleting product:", error);
    res.status(500).json({ message: "Failed to delete product" });
  }
};
