import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("authToken");

        const res = await axios.get(`${API_URL}/api/orders/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (Array.isArray(res.data)) {
          setOrders(res.data);
        } else {
          toast.warn("No orders found");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [API_URL]);

  const cancelOrder = async (id) => {
    try {
      const token = localStorage.getItem("authToken");

      await axios.put(
        `${API_URL}/api/orders/${id}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Order cancelled");

      setOrders((prev) =>
        prev.map((o) =>
          o._id === id ? { ...o, orderStatus: "Cancelled" } : o
        )
      );
    } catch (err) {
      toast.error("Failed to cancel order");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-indigo-600 font-semibold">
        Loading your orders...
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-700">
        <p className="mb-4 text-lg">No orders yet. Start shopping now!</p>
        <a
          href="/"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
        >
          Go Shopping
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4 md:px-16">
      <ToastContainer position="top-right" autoClose={3000} />

      <h1 className="text-3xl font-bold text-center text-indigo-700 mb-8">
        My Orders
      </h1>

      <div className="max-w-5xl mx-auto space-y-6">
        {orders.map((order, i) => (
          <div
            key={order._id}
            className="bg-white shadow-lg rounded-xl p-6 border border-indigo-100 hover:shadow-xl transition"
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-semibold text-indigo-700">
                Order #{i + 1}
              </h2>

              <span
                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  order.orderStatus === "Delivered"
                    ? "bg-green-100 text-green-700"
                    : order.orderStatus === "Cancelled"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {order.orderStatus}
              </span>
            </div>

            <p className="text-gray-600 mb-1">
              <b>Name:</b> {order.name}
            </p>
            <p className="text-gray-600 mb-1">
              <b>Mobile:</b> {order.mobile}
            </p>
            <p className="text-gray-600 mb-3">
              <b>Address:</b> {order.shippingAddress}
            </p>

            <div className="border-t mt-3 pt-3">
              <h3 className="text-lg font-medium mb-2">Items:</h3>
              {order.orderItems?.map((item, j) => (
                <div
                  key={j}
                  className="flex justify-between border-b py-1 text-gray-700"
                >
                  <span>{item.name || "Product"}</span>
                  <span>
                    ₹{item.price} × {item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t mt-3 pt-3">
              <p className="flex justify-between text-indigo-700 font-bold text-lg">
                <span>Total:</span>
                <span>₹{order.totalAmount}</span>
              </p>
            </div>

            <div className="mt-2 text-sm text-gray-500">
              Ordered On:{" "}
              <span className="text-gray-700 font-medium">
                {new Date(order.createdAt).toLocaleString()}
              </span>
            </div>

            {order.orderStatus === "Processing" && (
              <button
                onClick={() => cancelOrder(order._id)}
                className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Cancel Order
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
