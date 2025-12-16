// src/components/Products.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import { ReactTransliterate } from "react-transliterate";
import "react-toastify/dist/ReactToastify.css";
import "react-transliterate/dist/index.css";

const API_URL = import.meta.env.VITE_API_URL;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    nameEn: "",
    nameTa: "",
    price: "",
    stock: "",
    category: "",
    description: "",
    url: "",
    imageFile: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("adminToken");

  // ---------------- FETCH PRODUCTS ----------------
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = Array.isArray(res.data)
        ? res.data
        : res.data.products || [];

      const normalized = data.map((p) => ({
        ...p,
        name: typeof p.name === "string" ? { en: p.name, ta: "" } : p.name,
      }));

      setProducts(normalized);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to load products");
    }
  };

  // ---------------- FETCH CATEGORIES ----------------
  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/auth/admin/category`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCategories(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to load categories");
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("❌ Admin login required");
      return;
    }
    fetchProducts();
    fetchCategories();
  }, []);

  // ---------------- IMAGE SOURCE ----------------
  const getImageSource = (product) => {
    if (product.url) return product.url;
    if (product.image?.startsWith("http")) return product.image;
    if (product.image) return `${API_URL}${product.image}`;
    return "https://via.placeholder.com/200x150?text=No+Image";
  };

  // ---------------- CATEGORY NAME ----------------
  const getCategoryName = (category) => {
    if (!category) return "Unknown";
    const catId = category._id || category;
    const found = categories.find((c) => c._id === catId);
    return found
      ? `${found.name?.en || "-"} (${found.name?.ta || "-"})`
      : "Unknown";
  };

  // ---------------- EDIT ----------------
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      nameEn: product.name?.en || "",
      nameTa: product.name?.ta || "",
      price: product.price || "",
      stock: product.stock || "",
      category: product.category?._id || product.category || "",
      description: product.description || "",
      url: product.image || "",
      imageFile: null,
    });
    setImagePreview(getImageSource(product));
  };

  // ---------------- INPUT CHANGE ----------------
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "imageFile" && files?.length > 0) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, imageFile: file, url: "" }));
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (name === "url") setImagePreview(value);
    }
  };

  // ---------------- SAVE ----------------
  const handleSave = async () => {
    if (!editingProduct) return;
    setLoading(true);

    try {
      const data = new FormData();
      data.append("nameEn", formData.nameEn);
      data.append("nameTa", formData.nameTa);
      data.append("price", formData.price);
      data.append("stock", formData.stock);
      data.append("category", formData.category);
      data.append("description", formData.description);

      if (formData.imageFile) data.append("image", formData.imageFile);
      else if (formData.url) data.append("image", formData.url);

      await axios.put(
        `${API_URL}/api/auth/admin/products/${editingProduct._id}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("✅ Product updated successfully");
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error("❌ Update failed");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- DELETE ----------------
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(
        `${API_URL}/api/auth/admin/products/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("🗑️ Product deleted");
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error("❌ Delete failed");
    }
  };

  return (
    <div className="p-10 min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200">
      <ToastContainer position="top-center" autoClose={2000} />

      <h1 className="text-4xl font-extrabold text-center text-indigo-800 mb-10">
        🛍️ Product List
      </h1>

      {/* PRODUCTS GRID */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <motion.div
            key={product._id}
            className="bg-white p-5 rounded-2xl shadow-lg border"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <img
              src={getImageSource(product)}
              className="h-40 w-full object-cover rounded-xl mb-3"
            />

            <h2 className="font-bold text-lg">
              {product.name.en}{" "}
              <span className="text-indigo-600 text-sm">
                ({product.name.ta || "-"})
              </span>
            </h2>

            <p className="text-sm">
              Category:{" "}
              <strong>{getCategoryName(product.category)}</strong>
            </p>

            <p>💰 ₹{product.price}</p>
            <p>📦 Stock: {product.stock}</p>

            {product.description && (
              <p className="text-sm italic mt-2">{product.description}</p>
            )}

            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleEdit(product)}
                className="bg-yellow-400 px-3 py-1 rounded"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => handleDelete(product._id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                🗑️ Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ---------------- FULL EDIT MODAL ---------------- */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl"
          >
            <h2 className="text-2xl font-bold mb-4">✏️ Edit Product</h2>

            {/* ENGLISH NAME */}
            <input
              type="text"
              name="nameEn"
              value={formData.nameEn}
              onChange={handleChange}
              placeholder="Product Name (English)"
              className="w-full border p-2 rounded mb-2"
            />

            {/* TAMIL NAME */}
            <ReactTransliterate
              value={formData.nameTa}
              onChangeText={(text) =>
                setFormData((p) => ({ ...p, nameTa: text }))
              }
              lang="ta"
              placeholder="பொருள் பெயர் (தமிழ்)"
              className="w-full border p-2 rounded mb-2"
            />

            {/* DESCRIPTION */}
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Product Description"
              className="w-full border p-2 rounded mb-2 h-24"
            />

            {/* IMAGE URL */}
            <input
              type="text"
              name="url"
              value={formData.url}
              onChange={handleChange}
              placeholder="Image URL"
              className="w-full border p-2 rounded mb-2"
            />

            {/* IMAGE FILE */}
            <input
              type="file"
              name="imageFile"
              accept="image/*"
              onChange={handleChange}
              className="mb-2"
            />

            {imagePreview && (
              <img
                src={imagePreview}
                className="h-32 w-32 object-cover rounded mb-2"
              />
            )}

            {/* CATEGORY */}
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-2"
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name?.en} / {c.name?.ta}
                </option>
              ))}
            </select>

            {/* PRICE */}
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
              className="w-full border p-2 rounded mb-2"
            />

            {/* STOCK */}
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="Stock"
              className="w-full border p-2 rounded mb-4"
            />

            {/* BUTTONS */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditingProduct(null)}
                className="bg-gray-400 px-4 py-2 rounded text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="bg-blue-600 px-4 py-2 rounded text-white"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Products;
