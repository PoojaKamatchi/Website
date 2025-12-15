// src/components/Products.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Products = ({ products: initialProducts = [] }) => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const token = localStorage.getItem("adminToken");

  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
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

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data.products || res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to load products!");
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/auth/admin/category`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to load categories!");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, imageFile: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Save edited product
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
        `${API_URL}/api/auth/admin/products/${editingProduct._id}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("✅ Product updated successfully!");
      setEditingProduct(null);
      await fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to update product!");
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`${API_URL}/api/auth/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("🗑️ Product deleted!");
      await fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to delete product!");
    }
  };

  return (
    <div className="p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-3xl font-bold mb-6 text-blue-700">Products</h2>

      <div className="grid gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">{product.nameEn}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingProduct(product);
                    setFormData({
                      nameEn: product.nameEn,
                      nameTa: product.nameTa,
                      price: product.price,
                      stock: product.stock,
                      category: product.category,
                      description: product.description,
                      url: product.imageUrl,
                      imageFile: null,
                    });
                  }}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
            <p>Price: ₹{product.price}</p>
            <p>Stock: {product.stock}</p>
            <p>Category: {product.category}</p>
            <p>{product.description}</p>
          </div>
        ))}
      </div>

      {editingProduct && (
        <div className="mt-6 p-4 bg-gray-50 border rounded shadow">
          <h3 className="font-bold mb-4">Edit Product</h3>
          <input
            type="text"
            name="nameEn"
            value={formData.nameEn}
            onChange={handleFormChange}
            placeholder="Product Name (EN)"
            className="border p-2 w-full rounded mb-2"
          />
          <input
            type="text"
            name="nameTa"
            value={formData.nameTa}
            onChange={handleFormChange}
            placeholder="Product Name (TA)"
            className="border p-2 w-full rounded mb-2"
          />
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleFormChange}
            placeholder="Price"
            className="border p-2 w-full rounded mb-2"
          />
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleFormChange}
            placeholder="Stock"
            className="border p-2 w-full rounded mb-2"
          />
          <select
            name="category"
            value={formData.category}
            onChange={handleFormChange}
            className="border p-2 w-full rounded mb-2"
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c._id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleFormChange}
            placeholder="Description"
            className="border p-2 w-full rounded mb-2"
          />
          <input
            type="text"
            name="url"
            value={formData.url}
            onChange={handleFormChange}
            placeholder="Image URL"
            className="border p-2 w-full rounded mb-2"
          />
          <input
            type="file"
            name="imageFile"
            onChange={handleFormChange}
            className="mb-2"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => setEditingProduct(null)}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
