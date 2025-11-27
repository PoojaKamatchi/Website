// src/components/WishlistContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const WishlistContext = createContext();
export function useWishlist() { return useContext(WishlistContext); }

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const getToken = () => localStorage.getItem("authToken");

  const normalizeItems = (list = []) =>
    list.map(item => {
      const product = item.product || item;
      const name = typeof product.name === "object" ? product.name.en || product.name.ta : product.name;
      return { ...product, name };
    });

  // Fetch wishlist from backend
  const fetchWishlist = useCallback(async () => {
    const token = getToken();
    if (!token) { setWishlist([]); setLoading(false); return; }

    try {
      const res = await axios.get(`${API_URL}/api/wishlist`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWishlist(normalizeItems(res.data.wishlist?.products || []));
    } catch (err) {
      console.error("Failed to fetch wishlist:", err.response?.data || err.message);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  // Add product to wishlist
  const addToWishlist = async (product) => {
    const token = getToken();
    if (!token) return alert("Please login first!");
    if (!product?._id) return alert("Invalid product.");

    try {
      const res = await axios.post(`${API_URL}/api/wishlist/add`,
        { productId: product._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWishlist(normalizeItems(res.data.wishlist?.products || []));
    } catch (err) {
      console.error("Add to wishlist error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to add product to wishlist.");
    }
  };

  // Remove product from wishlist
  const removeFromWishlist = async (productId) => {
    const token = getToken();
    if (!token) return alert("Please login first!");
    if (!productId) return;

    try {
      const res = await axios.delete(`${API_URL}/api/wishlist/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWishlist(normalizeItems(res.data.wishlist?.products || []));
    } catch (err) {
      console.error("Remove from wishlist error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to remove product from wishlist.");
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, loading, fetchWishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}
