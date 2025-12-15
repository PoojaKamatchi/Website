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

const fetchCategories = async () => {
  try {
    const res = await axios.get(`${API_URL}/api/auth/admin/category`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCategories(res.data || []);
  } catch (err) {
    console.error("Error fetching categories:", err);
    toast.error("❌ Failed to load categories!");
  }
};

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
