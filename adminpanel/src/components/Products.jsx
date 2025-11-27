import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import { ReactTransliterate } from "react-transliterate";
import "react-toastify/dist/ReactToastify.css";
import "react-transliterate/dist/index.css";

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

  // ✅ Fetch Products
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      if (Array.isArray(res.data)) {
        setProducts(res.data);
      } else if (res.data.products) {
        setProducts(res.data.products);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to load products!");
    }
  };

  // ✅ Fetch Categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/category", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("❌ Admin token missing! Login required.");
      return;
    }
    fetchProducts();
    fetchCategories();
  }, []);

  // ✅ Handle Input Change
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

  // ✅ Get Image Source
  const getImageSource = (product) => {
    if (product.url) return product.url;
    if (product.image?.startsWith("http")) return product.image;
    if (product.image) return `http://localhost:5000${product.image}`;
    return "https://via.placeholder.com/200x150?text=No+Image";
  };

  // ✅ Get Category Name
  const getCategoryName = (category) => {
    if (!category) return "Unknown";
    const catId = category._id ? category._id : category;
    const found = categories.find((c) => c._id === catId);
    return found ? `${found.name?.en} (${found.name?.ta || "-"})` : "Unknown";
  };

  // ✅ Edit Product
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

  // ✅ Save Product (PUT)
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
      data.append("imageUrl", formData.url);
      if (formData.imageFile) data.append("image", formData.imageFile);

      await axios.put(
        `http://localhost:5000/api/auth/admin/products/${editingProduct._id}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("✅ Product updated successfully!");
      setEditingProduct(null);
      await fetchProducts(); // 🔄 Refresh after save
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to update product!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete Product
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/auth/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("🗑️ Product deleted!");
      await fetchProducts(); // Refresh to show updated stock
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to delete product!");
    }
  };

  return (
    <div className="p-10 min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200">
      <ToastContainer position="top-center" autoClose={2000} />
      <h1 className="text-4xl font-extrabold text-center text-indigo-800 mb-10">
        🛍️ Product List
      </h1>

      {products.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No products yet!</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <motion.div
              key={product._id}
              className="bg-white text-gray-800 p-5 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-transform border border-indigo-200"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <img
                src={getImageSource(product)}
                alt={product.name?.en}
                className="rounded-xl h-40 w-full object-cover mb-3 border border-gray-300"
              />
              <h2 className="font-bold text-lg">
                {product.name?.en}{" "}
                <span className="text-indigo-600 text-sm font-semibold">
                  ({product.name?.ta})
                </span>
              </h2>
              <p className="text-sm text-gray-600">
                Category:{" "}
                <span className="font-semibold text-gray-900">
                  {getCategoryName(product.category)}
                </span>
              </p>
              <p>💰 Price: ₹{product.price}</p>
              <p className="font-semibold text-gray-900">
                📦 Stock:{" "}
                <span
                  className={`${
                    product.stock <= 5
                      ? "text-red-500"
                      : product.stock <= 10
                      ? "text-yellow-500"
                      : "text-green-600"
                  }`}
                >
                  {product.stock}
                </span>
              </p>
              {product.description && (
                <p className="text-gray-700 mt-2 text-sm italic">
                  {product.description}
                </p>
              )}
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleEdit(product)}
                  className="bg-yellow-400 text-black px-3 py-1 rounded-lg hover:bg-yellow-500"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="bg-red-600 px-3 py-1 rounded-lg text-white hover:bg-red-700"
                >
                  🗑️ Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl"
          >
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">
              ✏️ Edit Product
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                name="nameEn"
                value={formData.nameEn}
                onChange={handleChange}
                placeholder="Product Name (English)"
                className="w-full border rounded-lg p-2"
              />
              <ReactTransliterate
                value={formData.nameTa}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, nameTa: text }))
                }
                lang="ta"
                placeholder="பொருள் பெயர் (தமிழ்)"
                className="w-full border rounded-lg p-2"
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Product Description"
                className="w-full border rounded-lg p-2 h-24 resize-none"
              />
              <input
                type="text"
                name="url"
                value={formData.url}
                onChange={handleChange}
                placeholder="Paste Image URL"
                className="w-full border rounded-lg p-2"
              />
              <input
                type="file"
                name="imageFile"
                accept="image/*"
                onChange={handleChange}
                className="w-full border p-2 rounded-lg"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-32 w-32 mt-3 rounded-lg object-cover border"
                />
              )}
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name?.en} / {cat.name?.ta || ""}
                  </option>
                ))}
              </select>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Price (₹)"
                className="w-full border rounded-lg p-2"
              />
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Stock"
                className="w-full border rounded-lg p-2"
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 bg-gray-400 text-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Products;
