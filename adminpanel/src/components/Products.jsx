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

      setProducts(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products");
    }
  };

  // ---------------- FETCH CATEGORIES ----------------
  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/auth/admin/category`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCategories(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    if (!token) return toast.error("Admin login required");
    fetchProducts();
    fetchCategories();
  }, []);

  // ---------------- IMAGE SOURCE ----------------
  const getImageSource = (product) => {
    if (!product?.image) return "https://via.placeholder.com/200";
    if (product.image.startsWith("http")) return product.image;
    return `${API_URL}${product.image}`;
  };

  // ---------------- EDIT ----------------
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      nameEn: product.name?.en || "",
      nameTa: product.name?.ta || "",
      price: product.price,
      stock: product.stock,
      category: product.category?._id || "",
      description: product.description || "",
      url: product.image || "",
      imageFile: null,
    });
    setImagePreview(getImageSource(product));
  };

  // ---------------- INPUT CHANGE ----------------
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imageFile" && files?.[0]) {
      setFormData({ ...formData, imageFile: files[0], url: "" });
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
      if (name === "url") setImagePreview(value);
    }
  };

  // ---------------- SAVE ----------------
  const handleSave = async () => {
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

      toast.success("Product updated");
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- DELETE ----------------
  const handleDelete = async (id) => {
    if (!window.confirm("Delete product?")) return;
    try {
      await axios.delete(
        `${API_URL}/api/auth/admin/products/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Deleted");
      fetchProducts();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <ToastContainer />
      <h1 className="text-3xl font-bold text-center mb-8">Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <motion.div
            key={p._id}
            className="bg-white p-4 rounded-xl shadow"
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={getImageSource(p)}
              className="h-40 w-full object-cover rounded"
            />
            <h2 className="font-bold mt-2">{p.name?.en}</h2>
            <p>₹{p.price}</p>
            <div className="flex justify-between mt-3">
              <button
                onClick={() => handleEdit(p)}
                className="bg-yellow-400 px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(p._id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* EDIT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg">
            <input
              name="nameEn"
              value={formData.nameEn}
              onChange={handleChange}
              placeholder="English Name"
              className="border p-2 w-full mb-2"
            />
            <ReactTransliterate
              value={formData.nameTa}
              onChangeText={(t) =>
                setFormData({ ...formData, nameTa: t })
              }
              lang="ta"
              className="border p-2 w-full mb-2"
            />
            <input
              type="file"
              name="imageFile"
              onChange={handleChange}
              className="mb-2"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                className="h-32 w-32 object-cover mb-2"
              />
            )}
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
