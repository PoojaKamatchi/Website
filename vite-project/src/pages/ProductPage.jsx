import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../components/CartContext";
import { useWishlist } from "../components/WishlistContext";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate(); // <-- added
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const { addToCart, cartItems, productStocks } = useCart();
  const { addToWishlist, wishlistItems } = useWishlist();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/products/category/${id}`);
        console.log("Fetched products:", res.data);
        setProducts(res.data || []); // Ensure fallback to empty array
      } catch (err) {
        console.error("❌ Error fetching products:", err);
        setProducts([]); // fallback
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProducts();
  }, [id]);

  if (loading)
    return (
      <div className="text-center mt-20 text-teal-700 font-medium">
        Loading products...
      </div>
    );

  if (!products.length)
    return (
      <div className="text-center mt-20 text-gray-600 text-lg">
        No products found in this category 😢
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-50 to-green-100 py-12 px-6">
      <h1 className="text-3xl font-bold text-center text-teal-800 mb-10">
        🛍️ Products in{" "}
        {products[0]?.category?.name?.ta || products[0]?.category?.name?.en || "this Category"}
      </h1>

      <div className="flex flex-wrap justify-center gap-10">
        {products.map((p) => {
          if (!p || !p._id) return null; // skip invalid product

          const currentStock = productStocks?.[p._id] ?? p.stock ?? 0;
          const isInCart = cartItems?.some((item) => item.product?._id === p._id);
          const isInWishlist = wishlistItems?.some((item) => item._id === p._id);

          return (
            <div
              key={p._id}
              onClick={() => navigate(`/product/${p._id}`)} // <-- navigate to single product
              className="cursor-pointer bg-white rounded-2xl shadow-md p-5 w-72 hover:shadow-2xl hover:scale-105 transition-transform duration-300 text-center border border-gray-100"
            >
              <img
                src={
                  p.image
                    ? p.image.startsWith("http")
                      ? p.image
                      : `${API_URL}${p.image}`
                    : "/placeholder.jpg"
                }
                alt={p.name?.en || "Product"}
                className="w-full h-48 object-cover rounded-xl mb-4 border border-gray-200"
              />

              <h3 className="text-lg font-semibold text-gray-800">
                {typeof p.name === "object"
                  ? p.name.en || p.name.ta || "Unnamed Product"
                  : p.name || "Unnamed Product"}
              </h3>

              <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                {p.description || "No description available."}
              </p>

              <p className="text-green-700 font-semibold mt-3 text-lg">₹{p.price ?? 0}</p>
              <p className={`text-sm mt-1 ${currentStock > 0 ? "text-green-500" : "text-red-500"}`}>
                {currentStock > 0 ? `In Stock: ${currentStock}` : "Out of Stock"}
              </p>

              <div className="flex gap-3 mt-5">
                {isInCart ? (
                  <button
                    disabled
                    className="flex-1 py-2 rounded-lg bg-gray-300 text-gray-700 cursor-not-allowed font-medium"
                    onClick={(e) => e.stopPropagation()} // prevent navigation
                  >
                    ✅ Added to Cart
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // prevent card click
                      addToCart(p);
                    }}
                    disabled={currentStock <= 0}
                    className={`flex-1 py-2 rounded-lg text-white transition font-medium ${
                      currentStock > 0 ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    🛒 Add to Cart
                  </button>
                )}

                {isInWishlist ? (
                  <button
                    disabled
                    className="flex-1 bg-gray-300 text-gray-700 rounded-lg py-2 cursor-not-allowed font-medium"
                    onClick={(e) => e.stopPropagation()} // prevent navigation
                  >
                    ❤️ In Wishlist
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // prevent card click
                      addToWishlist(p);
                    }}
                    className="flex-1 bg-pink-500 hover:bg-pink-600 text-white rounded-lg py-2 transition font-medium"
                  >
                    💖 Add to Wishlist
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
