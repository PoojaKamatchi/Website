import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const token = localStorage.getItem("adminToken");

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/orders/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data || []);
    } catch (err) {
      setError("Failed to load orders");
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

  const filterOrders = (status) => {
    setStatusFilter(status);
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `${API_URL}/api/orders/status/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Order status updated");
      fetchOrders();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const updatePayment = async (id, paymentStatus) => {
    try {
      await axios.put(
        `${API_URL}/api/orders/payment/${id}`,
        { paymentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Payment ${paymentStatus}`);
      fetchOrders();
    } catch {
      toast.error("Failed to update payment");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading orders...
      </div>
    );

  if (error)
    return <div className="text-center text-red-600 mt-10">{error}</div>;

  const filteredOrders =
    statusFilter === "All"
      ? orders
      : orders.filter((o) => o.status === statusFilter);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        Admin Orders Dashboard
      </h1>

      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {["All", "Processing", "Shipped", "Delivered", "Cancelled"].map(
          (s) => (
            <button
              key={s}
              onClick={() => filterOrders(s)}
              className={`px-4 py-2 rounded ${
                statusFilter === s ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              {s}
            </button>
          )
        )}
      </div>

      {/* Orders List */}
      {filteredOrders.map((order) => (
        <div
          key={order._id}
          className="bg-white p-6 mb-4 rounded shadow border-l-4 border-blue-500"
        >
          <div className="flex justify-between mb-2">
            <h3 className="font-semibold">Order ID: {order._id}</h3>
            <span className="text-sm text-gray-500">
              {new Date(order.createdAt).toLocaleString()}
            </span>
          </div>

          <p>
            <b>User:</b> {order.user?.name || order.name || "N/A"}
          </p>
          <p>
            <b>Email:</b> {order.user?.email || "N/A"}
          </p>
          <p>
            <b>Mobile:</b> {order.mobile || "N/A"}
          </p>
          <p>
            <b>Address:</b> {order.shippingAddress || "N/A"}
          </p>
          <p>
            <b>Total:</b> ₹{order.totalAmount}
          </p>
          <p className="mt-2">
            <b>Payment:</b>{" "}
            <span className="font-semibold">{order.paymentStatus || "Pending"}</span>
          </p>

          {/* Payment Actions */}
          <div className="flex gap-3 mt-2">
            <button
              onClick={() => updatePayment(order._id, "Approved")}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Approve
            </button>
            <button
              onClick={() => updatePayment(order._id, "Rejected")}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Reject
            </button>
          </div>

          {/* Status */}
          <div className="mt-4">
            <select
              value={order.status}
              onChange={(e) => updateStatus(order._id, e.target.value)}
              className="border p-2 rounded"
            >
              <option>Processing</option>
              <option>Shipped</option>
              <option>Delivered</option>
              <option>Cancelled</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orders;
