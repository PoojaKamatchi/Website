import React, { useState, useEffect } from "react";
import axios from "axios";
import { ReactTransliterate } from "react-transliterate";
import "react-transliterate/dist/index.css";

const AddCategory = () => {
  const [nameEn, setNameEn] = useState("");
  const [nameTa, setNameTa] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/auth/admin/category`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setCategories(res.data);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to load categories.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImageUrl("");
    setImagePreview(URL.createObjectURL(file));
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setImageUrl(url);
    setImageFile(null);
    setImagePreview(url || null);
  };

  const handleEdit = (category) => {
    setEditingId(category._id);
    setNameEn(category.name?.en || "");
    setNameTa(category.name?.ta || "");
    const imageSrc = category.image?.startsWith("http")
      ? category.image
      : `${API_URL}${category.image}`;
    setImagePreview(imageSrc);
    setImageFile(null);
    setImageUrl(category.image?.startsWith("http") ? category.image : "");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await axios.delete(`${API_URL}/api/auth/admin/category/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      alert("✅ Category deleted successfully!");
      fetchCategories();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete category.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nameEn.trim() || !nameTa.trim()) {
      alert("⚠️ Please enter both English and Tamil names.");
      return;
    }

    if (!imageFile && !imageUrl.trim()) {
      alert("⚠️ Please upload an image or enter an image URL.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", JSON.stringify({ en: nameEn.trim(), ta: nameTa.trim() }));

      if (imageFile) {
        formData.append("image", imageFile);
      } else if (imageUrl.trim()) {
        formData.append("imageUrl", imageUrl.trim());
      }

      if (editingId) {
        await axios.put(
          `${API_URL}/api/auth/admin/category/${editingId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );
        alert("✅ Category updated successfully!");
      } else {
        await axios.post(`${API_URL}/api/auth/admin/category`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        alert("✅ Category added successfully!");
      }

      setEditingId(null);
      setNameEn("");
      setNameTa("");
      setImageFile(null);
      setImageUrl("");
      setImagePreview(null);
      fetchCategories();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save category. Check backend logs.");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNameEn("");
    setNameTa("");
    setImageFile(null);
    setImageUrl("");
    setImagePreview(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-6">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-4xl p-8 border border-gray-200">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
          🗂️ {editingId ? "Edit Category" : "Add New Category"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Category Name (English)"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              className="w-full p-4 rounded-xl border-2 border-gray-300 focus:border-purple-500 outline-none"
            />
            <ReactTransliterate
              lang="ta"
              value={nameTa}
              onChangeText={setNameTa}
              placeholder="பொருள் பெயர் (தமிழ்)"
              className="w-full p-4 rounded-xl border-2 border-gray-300 bg-gray-50 outline-none"
            />
          </div>

          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-3 border rounded-lg"
            />
          </div>

          <div>
            <input
              type="text"
              placeholder="Or enter image URL (optional)"
              value={imageUrl}
              onChange={handleUrlChange}
              className="w-full p-3 border rounded-lg"
            />
          </div>

          {imagePreview && (
            <div className="flex justify-center">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg mt-2 border"
              />
            </div>
          )}

          <div className="flex space-x-2">
            <button
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-bold rounded-xl shadow-lg"
            >
              {editingId ? "✏️ Update Category" : "✨ Add Category"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="flex-1 py-3 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold rounded-xl shadow-lg"
              >
                ❌ Cancel
              </button>
            )}
          </div>
        </form>

        <hr className="my-6 border-gray-300" />

        <h2 className="text-xl font-semibold mb-4">Existing Categories</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {categories.length ? (
            categories.map((c) => (
              <div key={c._id} className="p-3 bg-gray-50 rounded-lg border relative">
                <p className="font-semibold">{c.name?.en}</p>
                <p className="text-sm text-gray-600">{c.name?.ta}</p>
                {c.image && (
                  <img
                    src={c.image.startsWith("http") ? c.image : `${API_URL}${c.image}`}
                    alt={c.name?.en}
                    className="w-full h-20 object-cover mt-2 rounded"
                  />
                )}
                <div className="flex justify-between mt-2">
                  <button
                    onClick={() => handleEdit(c)}
                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No categories yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
