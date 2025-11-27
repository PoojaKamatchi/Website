// src/components/CartContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const CartContext = createContext();
export function useCart() { return useContext(CartContext); }

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const getToken = () => localStorage.getItem("authToken");

  // Update cart summary
  useEffect(() => {
    const count = cartItems.reduce((sum, it) => sum + (it.quantity || 0), 0);
    const total = cartItems.reduce((sum, it) => sum + ((it.product?.price || 0) * (it.quantity || 0)), 0);
    setCartCount(count);
    setTotalPrice(total);
  }, [cartItems]);

  // Normalize cart items from backend
  const normalizeItems = (cart = {}) => {
    const itemsArr = cart.items || [];
    return itemsArr.map(item => {
      const product = item.product || {};
      const name = typeof product.name === "object" ? product.name.en || product.name.ta : product.name;
      return { ...item, product: { ...product, name }, quantity: item.quantity || 1 };
    });
  };

  // Fetch cart
  const fetchCart = useCallback(async () => {
    const token = getToken();
    if (!token) { setCartItems([]); setLoading(false); return; }
    try {
      const res = await axios.get(`${API_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(normalizeItems(res.data)); // ✅ Use res.data directly
    } catch (err) {
      console.error("Failed to fetch cart:", err.response?.data || err.message);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  // Add to cart
  const addToCart = async (product, quantity = 1) => {
    const token = getToken(); 
    if (!token) return alert("Please login first!");
    try {
      const existing = cartItems.find(i => i.product?._id === product._id);

      // Prevent adding beyond stock
      const desiredQty = existing ? existing.quantity + quantity : quantity;
      if (product.stock < desiredQty) {
        return alert("❌ Cannot add more than available stock!");
      }

      let res;
      if (existing) {
        res = await axios.put(`${API_URL}/api/cart/update`, {
          productId: product._id,
          quantity: desiredQty
        }, { headers: { Authorization: `Bearer ${token}` }});
      } else {
        res = await axios.post(`${API_URL}/api/cart/add`, {
          productId: product._id,
          quantity
        }, { headers: { Authorization: `Bearer ${token}` }});
      }

      setCartItems(normalizeItems(res.data)); // ✅ Use res.data directly
    } catch (err) {
      console.error("Add to cart error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to add product to cart.");
    }
  };

  // Update quantity
  const updateQuantity = async (productId, quantity) => {
    const token = getToken(); 
    if (!token) return alert("Please login first!");
    try {
      const res = await axios.put(`${API_URL}/api/cart/update`, { productId, quantity }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(normalizeItems(res.data));
    } catch (err) {
      console.error("Update quantity error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to update quantity.");
    }
  };

  // Remove from cart
  const removeFromCart = async (productId) => {
    const token = getToken(); 
    if (!token) return alert("Please login first!");
    try {
      const res = await axios.delete(`${API_URL}/api/cart/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(normalizeItems(res.data));
    } catch (err) {
      console.error("Remove from cart error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to remove item.");
    }
  };

  // Clear cart
  const clearCart = async () => {
    const token = getToken(); 
    if (!token) return alert("Please login first!");
    try {
      await axios.delete(`${API_URL}/api/cart/clear`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems([]);
    } catch (err) {
      console.error("Clear cart error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to clear cart.");
    }
  };

  return (
    <CartContext.Provider value={{
      cartItems, cartCount, totalPrice, loading,
      fetchCart, addToCart, updateQuantity, removeFromCart, clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}
