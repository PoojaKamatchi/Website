import React, { useEffect, useState } from "react";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const fetchOrders = async () => {
    try {
      const adminToken = localStorage.getItem("adminToken");
      if (!adminToken) {
        window.location.href = "/login";
        return;
      }

      const res = await axios.get(`${API_URL}/api/orders/all`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      const allOrders = res.data || [];
      setOrders(allOrders);
      setFilteredOrders(allOrders);
    } catch (err) {
      console.error("Fetch Orders Error:", err);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = (status) => {
    setStatusFilter(status);
    if (status === "All") setFilteredOrders(orders);
    else setFilteredOrders(orders.filter((o) => o.status === status));
  };

  const updateOrderStatus = async (id, newStatus) => {
    try {
      const adminToken = localStorage.getItem("adminToken");
      await axios.put(
        `${API_URL}/api/orders/status/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      fetchOrders();
    } catch (err) {
      console.error("Update Status Error:", err);
      alert("Failed to update status");
    }
  };

  const cancelOrder = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const adminToken = localStorage.getItem("adminToken");
      await axios.put(`${API_URL}/api/orders/${id}/cancel`, {}, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      fetchOrders();
    } catch (err) {
      console.error("Cancel Error:", err);
      alert("Failed to cancel order");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading orders...
      </div>
    );

  if (error)
    return <div className="text-center text-red-600 mt-10">{error}</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        Admin Orders Dashboard
      </h1>

      {/* Filter Buttons */}
      <div className="flex justify-center gap-4 mb-8">
        {["All", "Processing", "Shipped", "Delivered", "Cancelled"].map(
          (status) => (
            <button
              key={status}
              onClick={() => filterOrders(status)}
              className={`px-5 py-2 rounded-md font-medium transition ${
                statusFilter === status
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {status}
            </button>
          )
        )}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">No orders found.</div>
      ) : (
        <div className="grid gap-6">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg text-gray-800">
                  Order ID: {order._id}
                </h3>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="mt-3 text-gray-700">
                <p>
                  <strong>User:</strong> {order.user?.name || order.name || "N/A"} (
                  {order.user?.email || "N/A"})
                </p>
                <p>
                  <strong>Mobile:</strong> {order.mobile || "N/A"}
                </p>
                <p>
                  <strong>Address:</strong> {order.shippingAddress || "N/A"}
                </p>
                <p>
                  <strong>Payment Mode:</strong> {order.paymentMethod || "Cash on Delivery"}
                </p>
              </div>

              <div className="mt-4">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Ordered Items ({order.orderItems?.length || 0}):
                </h4>
                <ul className="list-disc list-inside text-gray-700">
                  {order.orderItems?.map((item, i) => (
                    <li key={i}>
                      {item.name || item.productId?.name || "Unknown Product"} × {item.quantity} — ₹{item.price}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <p className="font-semibold">
                  Total: ₹{order.totalAmount} (Shipping ₹{order.shippingCharge || 0})
                </p>
                <p>
                  Status: <span className="font-medium text-blue-600">{order.status}</span>
                </p>
              </div>

              <div className="mt-4 flex items-center gap-4">
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                  className="border p-2 rounded-md bg-gray-50"
                >
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                <button
                  onClick={() => cancelOrder(order._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
