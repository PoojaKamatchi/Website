// src/pages/CheckoutPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCart } from "../components/CartContext";
import { QRCodeSVG } from "qrcode.react";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, totalPrice, clearCart } = useCart();

  const finalAmount = totalPrice;

  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [loading, setLoading] = useState(false);

  const addressInputRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  /* Google Address */
  useEffect(() => {
    if (window.google && addressInputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        addressInputRef.current,
        { types: ["geocode"] }
      );
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place?.formatted_address) setAddress(place.formatted_address);
      });
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }
    setScreenshot(file);
  };

  const handlePlaceOrder = async () => {
    if (!name || !mobile || !address) {
      return toast.warn("Fill all details");
    }
    if (!screenshot) {
      return toast.warn("Upload payment screenshot");
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");

      const formData = new FormData();
      formData.append("name", name);
      formData.append("mobile", mobile);
      formData.append("shippingAddress", address);
      formData.append("totalAmount", finalAmount);
      formData.append(
        "orderItems",
        JSON.stringify(
          cartItems.map((item) => ({
            productId: item.product._id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
          }))
        )
      );
      formData.append("paymentScreenshot", screenshot);

      const res = await axios.post(`${API_URL}/api/orders/create`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await clearCart();
      navigate(`/order-success/${res.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 md:px-16">
      <ToastContainer />

      <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">
        Secure Checkout
      </h1>

      {/* 🌿 TRUST SECTION */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="bg-green-50 border border-green-300 p-5 rounded-xl shadow">
          <h3 className="text-green-800 font-bold text-xl mb-2">
            🌿 100% Trusted Ayurvedic & Organic Products
          </h3>
          <p className="text-gray-700 text-sm leading-relaxed">
            ✔ Pure Ayurvedic medicines & organic products<br />
            ✔ No chemicals • No side effects • Natural preparation<br />
            ✔ Trusted by customers for quality & safety
          </p>
        </div>
      </div>

      {/* 🔐 PAYMENT TRUST */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-blue-50 border border-blue-300 p-5 rounded-xl shadow">
          <h3 className="text-blue-800 font-semibold text-lg mb-2">
            🔒 Safe & Secure Payment
          </h3>
          <p className="text-gray-700 text-sm leading-relaxed">
            ✔ Payment verified manually by our team<br />
            ✔ Any issue → <b>Amount will be safely returned</b><br />
            ✔ Customer trust is our first priority
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
        {/* LEFT */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mb-3 border px-3 py-2 rounded"
          />
          <input
            placeholder="Mobile"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="w-full mb-3 border px-3 py-2 rounded"
          />
          <input
            ref={addressInputRef}
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full mb-3 border px-3 py-2 rounded"
          />

          <p className="font-medium mb-2">UPI Payment</p>
          <QRCodeSVG
            value={`upi://pay?pa=poojamuralipooja248@oksbi&pn=Pooja&am=${finalAmount}&cu=INR`}
            size={180}
          />

          {/* 💰 AMOUNT CLARITY */}
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-900 p-3 rounded-lg mt-4 text-center">
            <p className="font-bold text-lg">Pay Only ₹{finalAmount}</p>
            <p className="text-sm">Exact amount • No hidden charges</p>
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-4"
          />

          <p className="text-sm text-green-700 mt-2">
            📸 Upload payment screenshot for quick confirmation
          </p>

          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="w-full mt-4 bg-indigo-600 text-white py-2 rounded"
          >
            {loading ? "Placing Order..." : `Place Order ₹${finalAmount}`}
          </button>
        </div>

        {/* RIGHT */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          {cartItems.map((item) => (
            <div key={item.product._id} className="flex justify-between mb-2">
              <span>{item.product.name}</span>
              <span>
                ₹{item.product.price} × {item.quantity}
              </span>
            </div>
          ))}
          <hr />
          <p className="font-bold mt-3">Total: ₹{finalAmount}</p>
        </div>
      </div>

      <p className="text-center text-sm text-gray-700 mt-8">
        🌱 Honest service • Safe payment • Customer satisfaction guaranteed
      </p>
    </div>
  );
}
