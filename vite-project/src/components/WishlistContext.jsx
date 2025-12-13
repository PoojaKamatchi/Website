import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const WishlistContext = createContext();

export function useWishlist() {
  return useContext(WishlistContext);
}

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const getToken = () => localStorage.getItem("authToken");

  const normalizeItems = (list = []) =>
    list.map((product) => {
      const name =
        typeof product?.name === "object"
          ? product?.name?.ta || product?.name?.en
          : product?.name;
      return { ...product, name };
    });

  // Fetch wishlist from backend
  const fetchWishlist = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setWishlist([]);
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.get(`${API_URL}/api/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // CRT order: latest first
      const sorted = (data.products || []).reverse();
      setWishlist(normalizeItems(sorted));
    } catch (err) {
      console.error("Failed to fetch wishlist:", err.response?.data || err.message);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // Add item
  const addToWishlist = async (product) => {
    const token = getToken();
    if (!token) return alert("Please login first!");

    try {
      // Optimistic update: add to top
      setWishlist((prev) => [product, ...prev]);

      const { data } = await axios.post(
        `${API_URL}/api/wishlist/add`,
        { productId: product._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const sorted = (data.products || []).reverse();
      setWishlist(normalizeItems(sorted));
    } catch (err) {
      console.error("Failed to add to wishlist:", err.response?.data || err.message);
      fetchWishlist();
    }
  };

  // Remove item
  const removeFromWishlist = async (productId) => {
    const token = getToken();
    if (!token) return alert("Please login first!");

    try {
      // Optimistic update
      setWishlist((prev) => prev.filter((item) => item._id !== productId));

      const { data } = await axios.delete(
        `${API_URL}/api/wishlist/remove/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const sorted = (data.products || []).reverse();
      setWishlist(normalizeItems(sorted));
    } catch (err) {
      console.error("Failed to remove from wishlist:", err.response?.data || err.message);
      fetchWishlist();
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        fetchWishlist,
        addToWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
