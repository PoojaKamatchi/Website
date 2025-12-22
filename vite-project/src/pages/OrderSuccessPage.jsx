// src/pages/OrderSuccessPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCart } from "../components/CartContext";
import { QRCodeSVG } from "qrcode.react";

export default function OrderSuccessPage() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { clearCart } = useCart();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Not logged in");

        // Try fetching single order by ID first
        let res;
        try {
          res = await axios.get(`${API_URL}/api/orders/${orderId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setOrder(res.data);
        } catch {
          // fallback: fetch all orders and take the latest
          const allOrdersRes = await axios.get(`${API_URL}/api/orders/user`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (Array.isArray(allOrdersRes.data) && allOrdersRes.data.length > 0) {
            const latestOrder = allOrdersRes.data[allOrdersRes.data.length - 1];
            setOrder(latestOrder);
          } else {
            toast.warn("No order found.");
          }
        }

        await clearCart(); // ensure cart is cleared
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch order details.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-indigo-600 font-semibold">
        Loading order details...
      </div>
    );

  if (!order)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-700">
        <p className="mb-4 text-lg">Order not found.</p>
        <button
          onClick={() => navigate("/")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
        >
          Go Home
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex flex-col items-center justify-center px-4 md:px-16 py-10">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-white shadow-2xl rounded-2xl p-10 max-w-3xl w-full text-center animate-fadeIn">
        <h1 className="text-4xl font-bold text-green-700 mb-4">🎉 Order Placed Successfully!</h1>
        <p className="text-gray-700 mb-6 text-lg">Thank you for your purchase, <span className="font-semibold">{order.name}</span>!</p>

        {/* Order Info */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6 text-left space-y-2">
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>Amount Paid:</strong> ₹ {order.totalAmount}</p>
          <p><strong>Payment Method:</strong> {order.paymentMethod || "UPI"}</p>
         <p><strong>Status:</strong> {order.orderStatus}</p>

          <p><strong>Delivery Address:</strong> {order.shippingAddress}</p>
          <p><strong>Ordered On:</strong> {new Date(order.createdAt).toLocaleString()}</p>
        </div>

        {/* QR code for UPI */}
        {order.paymentScreenshot && (
  <div className="mb-6">
    <p className="font-medium text-gray-700 mb-2">Payment Screenshot:</p>
    <img src={order.paymentScreenshot} alt="Payment" className="mx-auto max-h-60 rounded-md" />
  </div>
)}


        {/* Items Ordered */}
        <div className="mb-6 text-left">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Items Ordered:</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto border p-3 rounded-md bg-white">
            {order.orderItems?.map((item, i) => (
              <div key={i} className="flex justify-between text-gray-700 border-b border-gray-100 py-1">
                <span>{item.name}</span>
                <span>₹ {item.price} × {item.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row justify-center gap-4 mt-4">
          <button
            onClick={() => navigate("/orders")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            View My Orders
          </button>
          <button
            onClick={() => navigate("/")}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
