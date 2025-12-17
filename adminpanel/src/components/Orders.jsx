import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const token = localStorage.getItem("adminToken");

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/orders/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data || []);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }
    fetchOrders();
  }, []);

  const filteredOrders =
    statusFilter === "All"
      ? orders
      : orders.filter((o) => o.orderStatus === statusFilter);

  const updateStatus = async (id, status) => {
    await axios.put(
      `${API_URL}/api/orders/status/${id}`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    toast.success("Order status updated");
    fetchOrders();
  };

  const updatePayment = async (id, paymentStatus) => {
    await axios.put(
      `${API_URL}/api/orders/payment/${id}`,
      { paymentStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    toast.success(`Payment ${paymentStatus}`);
    fetchOrders();
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <ToastContainer />

      <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">
        Admin Orders Dashboard
      </h1>

      <div className="flex justify-center gap-3 mb-6">
        {["All", "Processing", "Shipped", "Delivered", "Cancelled"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded ${
              statusFilter === s
                ? "bg-blue-600 text-white"
                : "bg-gray-300"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {filteredOrders.map((order) => {
        const imageUrl = order.paymentScreenshot
          ? order.paymentScreenshot.startsWith("http")
            ? order.paymentScreenshot
            : `${API_URL}${order.paymentScreenshot}`
          : null;

        return (
          <div key={order._id} className="bg-white p-6 mb-5 rounded shadow">
            <p><b>Order ID:</b> {order._id}</p>
            <p><b>User:</b> {order.user?.name}</p>
            <p><b>Email:</b> {order.user?.email}</p>
            <p><b>Mobile:</b> {order.mobile}</p>

            <p className="text-sm text-gray-500">
              Ordered On: {new Date(order.createdAt).toLocaleString("en-IN")}
            </p>

            <p className="mt-1"><b>Total:</b> ₹{order.totalAmount}</p>
            <p><b>Payment Status:</b> {order.paymentStatus}</p>

            {/* ✅ SCREENSHOT */}
            {imageUrl && (
              <div className="mt-3">
                <p className="font-semibold mb-1">UPI Screenshot:</p>
                <img
                  src={imageUrl}
                  alt="Payment Screenshot"
                  className="w-56 border rounded cursor-pointer"
                  onClick={() => window.open(imageUrl, "_blank")}
                />
              </div>
            )}

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => updatePayment(order._id, "Approved")}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Approve
              </button>
              <button
                onClick={() => updatePayment(order._id, "Rejected")}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Reject
              </button>
            </div>

            <select
              value={order.orderStatus}
              onChange={(e) => updateStatus(order._id, e.target.value)}
              className="border mt-3 p-2 rounded"
            >
              <option>Processing</option>
              <option>Shipped</option>
              <option>Delivered</option>
              <option>Cancelled</option>
            </select>
          </div>
        );
      })}
    </div>
  );
};

export default Orders;
