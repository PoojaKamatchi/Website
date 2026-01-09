// src/components/Users.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const token = localStorage.getItem("adminToken");

  // ---------------- FETCH USERS ----------------
  const fetchUsers = async () => {
    if (!token) {
      toast.error("❌ Admin login required");
      window.location.href = "/admin/login"; // ✅ FIX
      return;
    }

    try {
      const res = await axios.get(`${API_URL}/api/auth/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data || []);
    } catch (err) {
      toast.error("Session expired. Please login again.");
      localStorage.removeItem("adminToken");
      window.location.href = "/admin/login"; // ✅ FIX
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

      {/* MOBILE VIEW */}
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

      {/* DESKTOP VIEW */}
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
              <motion.tr key={u._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{idx + 1}</td>
                <td className="py-3 px-4">
                  <img
                    src={u.profilePic || "https://via.placeholder.com/40"}
                    className="w-10 h-10 rounded-full"
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
    </div>
  );
}
