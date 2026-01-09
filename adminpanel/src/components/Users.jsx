// src/components/Users.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();

  // ---------------- FETCH USERS ----------------
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("adminToken"); // ✅ Read here

      if (!token) {
        toast.error("❌ Admin login required");
        return navigate("/admin/login"); // ✅ React Router redirect
      }

      // ✅ Correct API path
      const res = await axios.get(`${API_URL}/api/auth/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(res.data || []);
    } catch (err) {
      console.error("Fetch Users Error:", err.response || err);
      toast.error("Session expired. Please login again.");
      localStorage.removeItem("adminToken");
      navigate("/admin/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen font-semibold text-indigo-700">
        Loading users...
      </div>
    );

  return (
    <div className="min-h-screen p-10 bg-gradient-to-br from-blue-100 to-indigo-200">
      <ToastContainer position="top-center" autoClose={2000} />

      <h1 className="text-4xl font-extrabold text-center text-indigo-800 mb-10">
        👥 Users List
      </h1>

      {/* ================= MOBILE VIEW (CARDS) ================= */}
      <div className="grid grid-cols-1 gap-6 sm:hidden">
        {users.map((u) => (
          <motion.div
            key={u._id}
            className="bg-white rounded-2xl p-4 shadow-lg flex items-center gap-4"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <img
              src={u.profilePic || "https://via.placeholder.com/50"}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <h2 className="font-semibold text-indigo-700">{u.name}</h2>
              <p className="text-gray-600 text-sm">{u.email}</p>
              <p className="text-gray-700 text-sm capitalize">
                Role: {u.role || "Customer"}
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedUser(u);
                setModalOpen(true);
              }}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
            >
              View
            </button>
          </motion.div>
        ))}
      </div>

      {/* ================= DESKTOP VIEW (TABLE) ================= */}
      <div className="hidden sm:block bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="py-3 px-4">#</th>
              <th className="py-3 px-4">Avatar</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, idx) => (
              <motion.tr
                key={u._id}
                className="border-b hover:bg-gray-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <td className="py-3 px-4">{idx + 1}</td>
                <td className="py-3 px-4">
                  <img
                    src={u.profilePic || "https://via.placeholder.com/40"}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </td>
                <td className="py-3 px-4">{u.name}</td>
                <td className="py-3 px-4">{u.email}</td>
                <td className="py-3 px-4 capitalize">{u.role || "Customer"}</td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => {
                      setSelectedUser(u);
                      setModalOpen(true);
                    }}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    View
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MODAL ================= */}
      {modalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl relative"
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-3 right-3 text-xl font-bold"
            >
              ×
            </button>

            <div className="flex flex-col items-center gap-3">
              <img
                src={selectedUser.profilePic || "https://via.placeholder.com/80"}
                className="w-20 h-20 rounded-full"
              />
              <h2 className="text-xl font-bold text-indigo-700">{selectedUser.name}</h2>
              <p className="text-gray-700">{selectedUser.email}</p>
              <p className="capitalize text-gray-700">
                Role: {selectedUser.role || "Customer"}
              </p>
              <p className="text-gray-700">Phone: {selectedUser.phone || "N/A"}</p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
