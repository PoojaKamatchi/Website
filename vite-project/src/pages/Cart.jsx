import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../components/CartContext.jsx";

export default function Cart() {
  const { cartItems, totalPrice, loading, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-indigo-600 text-xl font-semibold">
        Loading your cart...
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-gray-600 text-lg mb-4">🛒 Your cart is empty</p>
        <button
          onClick={() => navigate("/")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
        >
          Go Shopping
        </button>
      </div>
    );
  }

  const handleProceedToCheckout = () => {
    navigate("/checkout", { state: { cartItems, totalPrice, shippingCharge: 40 } });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 md:px-16">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6 text-center">Your Shopping Cart</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-md">
          {cartItems.map((item) => (
            <div key={item.product._id} className="flex items-center justify-between border-b py-4">
              <div className="flex items-center space-x-4">
                <img
                  src={item.product.image || "https://via.placeholder.com/100"}
                  alt={item.product.name?.en || "Product"}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">{item.product.name?.en}</h3>
                  <p className="text-sm text-gray-500">{item.product.description}</p>
                  <p className="font-medium text-indigo-600">₹ {item.product.price}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => updateQuantity(item.product._id, Math.max(item.quantity - 1, 1))}
                  className="bg-gray-200 px-2 rounded"
                >-</button>
                <span className="text-lg font-semibold">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                  className="bg-gray-200 px-2 rounded"
                >+</button>
                <button
                  onClick={() => removeFromCart(item.product._id)}
                  className="text-red-500 hover:text-red-700 ml-4"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md h-fit">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Order Summary</h2>
          <p className="flex justify-between text-gray-700 mb-2">
            <span>Subtotal:</span>
            <span>₹ {totalPrice}</span>
          </p>
          <p className="flex justify-between text-gray-700 mb-2">
            <span>Shipping:</span>
            <span>₹ 40</span>
          </p>
          <hr className="my-3" />
          <p className="flex justify-between font-bold text-lg text-indigo-700">
            <span>Total:</span>
            <span>₹ {totalPrice + 40}</span>
          </p>
          <button
            onClick={handleProceedToCheckout}
            className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition duration-300"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
