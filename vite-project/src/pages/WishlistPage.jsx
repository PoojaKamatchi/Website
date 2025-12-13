import React, { useState } from "react";
import { useWishlist } from "../components/WishlistContext";
import { useCart } from "../components/CartContext";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [message, setMessage] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 2000);
  };

  if (!wishlist.length) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-teal-50 to-green-100">
        <h2 className="text-3xl font-bold text-gray-700 mb-3">
          💖 Your Wishlist is Empty
        </h2>
        <p className="text-gray-500">
          Browse products and click ❤️ to add them here!
        </p>
        {message && (
          <div className="mt-4 px-4 py-2 bg-green-100 text-green-800 rounded-lg shadow-md">
            {message}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-50 to-green-100 py-12 px-6 relative">
      <h1 className="text-3xl font-bold text-center text-teal-800 mb-10">
        💖 Your Wishlist
      </h1>

      {message && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 bg-green-200 text-green-800 rounded-lg shadow-md z-50">
          {message}
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-10">
        {wishlist.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-2xl shadow-md p-5 w-72 hover:shadow-2xl hover:scale-105 transition-transform duration-300 text-center border border-gray-100"
          >
            <img
              src={item.image?.startsWith("http") ? item.image : `${API_URL}${item.image}`}
              alt={item.name}
              className="w-full h-48 object-cover rounded-xl mb-4 border border-gray-200"
            />
            <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
            <p className="text-gray-500 text-sm mt-1 line-clamp-2">
              {item.description || "No description available."}
            </p>
            <p className="text-green-700 font-semibold mt-3 text-lg">₹{item.price}</p>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  addToCart(item); // add to cart
                  removeFromWishlist(item._id); // remove from wishlist
                  showMessage("✅ Product added to cart!");
                }}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2 transition"
              >
                🛒 Add to Cart
              </button>

              <button
                onClick={() => {
                  removeFromWishlist(item._id);
                  showMessage("💖 Product removed!");
                }}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-lg py-2 transition"
              >
                ❌ Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
