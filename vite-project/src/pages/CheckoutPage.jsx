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
  const { cartItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();

  const finalAmount = totalPrice;

  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [paymentMethod] = useState("UPI"); // ✅ COD removed
  const [screenshot, setScreenshot] = useState(null);
  const [loading, setLoading] = useState(false);

  const addressInputRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (window.google && addressInputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(addressInputRef.current, {
        types: ["geocode"],
      });
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place?.formatted_address) setAddress(place.formatted_address);
      });
    }
  }, []);

  const handleFileChange = (e) => setScreenshot(e.target.files[0]);

 const handlePlaceOrder = async () => {
  if (!screenshot) return toast.warn("Upload payment screenshot");

  try {
    setLoading(true);
    const token = localStorage.getItem("authToken");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("mobile", mobile);
    formData.append("shippingAddress", address);
    formData.append("totalAmount", finalAmount);
    formData.append("orderItems", JSON.stringify(
      cartItems.map(item => ({
        productId: item.product._id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      }))
    ));
    formData.append("paymentScreenshot", screenshot);

    const res = await axios.post(
      `${API_URL}/api/orders/create`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

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
      <h1 className="text-3xl font-bold text-center text-indigo-700 mb-8">Checkout Page</h1>

      <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
        {/* LEFT */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}
            className="w-full mb-3 border px-3 py-2 rounded" />
          <input placeholder="Mobile" value={mobile} onChange={(e) => setMobile(e.target.value)}
            className="w-full mb-3 border px-3 py-2 rounded" />
          <input ref={addressInputRef} placeholder="Address" value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full mb-3 border px-3 py-2 rounded" />

          <p className="font-medium mb-2">Online Payment (UPI)</p>
          <QRCodeSVG
            value={`upi://pay?pa=poojamuralipooja248@oksbi&pn=Pooja&am=${finalAmount}&cu=INR`}
            size={180}
          />

          <input type="file" onChange={handleFileChange} className="mt-4" />

          <button onClick={handlePlaceOrder} disabled={loading}
            className="w-full mt-4 bg-indigo-600 text-white py-2 rounded">
            {loading ? "Placing..." : `Place Order ₹${finalAmount}`}
          </button>
        </div>

        {/* RIGHT */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          {cartItems.map((item) => (
            <div key={item.product._id} className="flex justify-between mb-2">
              <span>{item.product.name}</span>
              <span>₹{item.product.price} × {item.quantity}</span>
            </div>
          ))}
          <hr />
          <p className="font-bold mt-3">Total: ₹{finalAmount}</p>
        </div>
      </div>
    </div>
  );
}
