import React, { useEffect, useState } from "react";
import axios from "axios";

const STATUS_LIST = [
  "All",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [activeStatus, setActiveStatus] = useState("All");
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const token = localStorage.getItem("adminToken");

  /* ================= FETCH ORDERS ================= */
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/orders/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Fetch Orders Error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ================= UPDATE PAYMENT ================= */
  const updatePayment = async (id, status) => {
    await axios.put(
      `${API_URL}/api/orders/payment/${id}`,
      { paymentStatus: status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchOrders();
  };

  /* ================= UPDATE ORDER STATUS ================= */
  const updateOrderStatus = async (id, status) => {
    await axios.put(
      `${API_URL}/api/orders/status/${id}`,
      { orderStatus: status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchOrders();
  };

  /* ================= FILTER ================= */
  const filteredOrders =
    activeStatus === "All"
      ? orders
      : orders.filter((o) => o.orderStatus === activeStatus);

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading orders...</h2>;
  }

  return (
    <div style={{ padding: 20, background: "#f5f7fb", minHeight: "100vh" }}>
      <h2 style={{ marginBottom: 20 }}>📦 Admin Orders</h2>

      {/* ================= STATUS FILTER BUTTONS ================= */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {STATUS_LIST.map((status) => (
          <button
            key={status}
            onClick={() => setActiveStatus(status)}
            style={{
              padding: "8px 16px",
              borderRadius: 20,
              border: "none",
              cursor: "pointer",
              background:
                activeStatus === status ? "#2563eb" : "#e5e7eb",
              color: activeStatus === status ? "#fff" : "#000",
              fontWeight: 600,
            }}
          >
            {status}
          </button>
        ))}
      </div>

      {/* ================= ORDERS ================= */}
      {filteredOrders.length === 0 && (
        <p>No orders in {activeStatus} status</p>
      )}

      {filteredOrders.map((order) => (
        <div
          key={order._id}
          style={{
            background: "#fff",
            padding: 20,
            borderRadius: 12,
            marginBottom: 20,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <h4>{order.name}</h4>
              <p>📞 {order.mobile}</p>
            </div>
            <span
              style={{
                padding: "4px 12px",
                borderRadius: 20,
                background: "#eef2ff",
                fontWeight: 600,
              }}
            >
              {order.orderStatus}
            </span>
          </div>

          <p style={{ marginTop: 10 }}>
            📍 {order.shippingAddress}
          </p>

          <hr />

          {/* ITEMS */}
          {order.orderItems.map((item, i) => (
            <p key={i}>
              {item.name} × {item.quantity} = ₹
              {item.price * item.quantity}
            </p>
          ))}

          <p><b>Total:</b> ₹{order.totalAmount}</p>

          <hr />

          {/* PAYMENT */}
          <p>
            <b>Payment:</b>{" "}
            <span
              style={{
                color:
                  order.paymentStatus === "Approved"
                    ? "green"
                    : order.paymentStatus === "Rejected"
                    ? "red"
                    : "orange",
              }}
            >
              {order.paymentStatus}
            </span>
          </p>

          {order.paymentScreenshot && (
            <a
              href={
                order.paymentScreenshot.startsWith("http")
                  ? order.paymentScreenshot
                  : `${API_URL}${order.paymentScreenshot}`
              }
              target="_blank"
              rel="noreferrer"
            >
              📷 View Screenshot
            </a>
          )}

          <div style={{ marginTop: 10 }}>
            <button
              onClick={() => updatePayment(order._id, "Approved")}
              style={{ marginRight: 10 }}
            >
              ✅ Approve
            </button>
            <button
              onClick={() => updatePayment(order._id, "Rejected")}
            >
              ❌ Reject
            </button>
          </div>

          <hr />

          {/* STATUS CHANGE */}
          <select
            value={order.orderStatus}
            onChange={(e) =>
              updateOrderStatus(order._id, e.target.value)
            }
          >
            <option>Processing</option>
            <option>Shipped</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>

          <p style={{ marginTop: 8, fontSize: 12 }}>
            🕒 {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Orders;
