import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../components/CartContext";
import { toast, ToastContainer } from "react-toastify";
import { QRCodeSVG } from "qrcode.react";
import "react-toastify/dist/ReactToastify.css";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, totalPrice, clearCart } = useCart();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [loading, setLoading] = useState(false);

  const addressInputRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleFileChange = (e) => setScreenshot(e.target.files[0]);

  const handlePlaceOrder = async () => {
    if (!cartItems.length) return toast.error("Cart is empty");
    if (!name || !mobile || !address) return toast.warn("Fill all fields");
    if (!screenshot) return toast.warn("Upload payment screenshot");

    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const formData = new FormData();

      formData.append("name", name);
      formData.append("mobile", mobile);
      formData.append("address", address);
      formData.append("totalAmount", totalPrice);
      formData.append("paymentMethod", "UPI");
      formData.append("paymentScreenshot", screenshot);

      cartItems.forEach((item, index) => {
        formData.append(`cartItems[${index}][productId]`, item.product._id);
        formData.append(`cartItems[${index}][name]`, item.product.name);
        formData.append(`cartItems[${index}][price]`, item.product.price);
        formData.append(`cartItems[${index}][quantity]`, item.quantity);
      });

      const res = await axios.post(`${API_URL}/api/orders/create`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      await clearCart();
      navigate(`/order-success/${res.data.order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <ToastContainer />
      <h1 className="text-3xl font-bold text-center text-indigo-700 mb-8">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-lg space-y-3">
          <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full border px-3 py-2 rounded"/>
          <input type="text" placeholder="Mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} className="w-full border px-3 py-2 rounded"/>
          <input ref={addressInputRef} type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border px-3 py-2 rounded"/>
          <p className="font-medium mt-2">Online Payment (UPI)</p>
          <QRCodeSVG value={`upi://pay?pa=poojamuralipooja248@oksbi&pn=Pooja&am=${totalPrice}&cu=INR`} size={180}/>
          <input type="file" onChange={handleFileChange} className="mt-4"/>
          <button onClick={handlePlaceOrder} disabled={loading} className="w-full mt-4 bg-indigo-600 text-white py-2 rounded">{loading ? "Placing..." : `Place Order ₹${totalPrice}`}</button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          {cartItems.map(item => (
            <div key={item.product._id} className="flex justify-between mb-2">
              <span>{item.product.name}</span>
              <span>₹{item.product.price} × {item.quantity}</span>
            </div>
          ))}
          <hr className="my-3"/>
          <p className="font-bold">Total: ₹{totalPrice}</p>
        </div>
      </div>
    </div>
  );
}
