import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useCart } from "../components/CartContext";
import { useWishlist } from "../components/WishlistContext";

export default function SingleProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const { addToCart, cartItems, productStocks } = useCart();
  const { addToWishlist, wishlistItems } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="text-center mt-20">Loading product...</div>;
  if (!product) return <div className="text-center mt-20">Product not found 😢</div>;

  const currentStock = productStocks?.[product._id] ?? product.stock ?? 0;
  const isInCart = cartItems?.some((item) => item.product?._id === product._id);
  const isInWishlist = wishlistItems?.some((item) => item._id === product._id);

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-50 to-green-100 py-12 px-6 flex justify-center">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-3xl text-center">
        <img
          src={product.image?.startsWith("http") ? product.image : `${API_URL}${product.image}`}
          alt={product.name?.en || "Product"}
          className="w-full h-96 object-cover rounded-xl mb-6"
        />
        <h1 className="text-3xl font-bold text-gray-800">{product.name?.en || "Unnamed Product"}</h1>
        <p className="text-gray-500 mt-2">{product.description || "No description available."}</p>
        <p className="text-green-700 font-semibold mt-3 text-xl">₹{product.price ?? 0}</p>
        <p className={`text-sm mt-1 ${currentStock > 0 ? "text-green-500" : "text-red-500"}`}>
          {currentStock > 0 ? `In Stock: ${currentStock}` : "Out of Stock"}
        </p>

        <div className="flex gap-3 mt-5 justify-center">
          {isInCart ? (
            <button disabled className="py-2 px-5 rounded-lg bg-gray-300 text-gray-700 cursor-not-allowed">
              ✅ Added to Cart
            </button>
          ) : (
            <button
              onClick={() => addToCart(product)}
              disabled={currentStock <= 0}
              className={`py-2 px-5 rounded-lg text-white ${
                currentStock > 0 ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              🛒 Add to Cart
            </button>
          )}

          {isInWishlist ? (
            <button disabled className="py-2 px-5 bg-gray-300 text-gray-700 rounded-lg">
              ❤️ In Wishlist
            </button>
          ) : (
            <button
              onClick={() => addToWishlist(product)}
              className="py-2 px-5 bg-pink-500 hover:bg-pink-600 text-white rounded-lg"
            >
              💖 Add to Wishlist
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
