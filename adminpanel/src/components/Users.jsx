import React, { useEffect, useState } from "react";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const token = localStorage.getItem("adminToken");

  const fetchUsers = async () => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const res = await axios.get(`${API_URL}/api/auth/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data || []);
    } catch (err) {
      alert("Session expired. Please login again.");
      localStorage.removeItem("adminToken");
      window.location.href = "/login";
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen font-semibold">
        Loading users...
      </div>
    );

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Users</h1>

      {/* ================= MOBILE VIEW (CARDS - NO 1,2,3) ================= */}
      <div className="grid grid-cols-1 gap-4 sm:hidden">
        {users.map((u) => (
          <div
            key={u._id}
            className="bg-white p-4 rounded-xl shadow flex items-center gap-4"
          >
            <img
              src={u.profilePic || "https://via.placeholder.com/50"}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <h2 className="font-semibold">{u.name}</h2>
              <p className="text-sm text-gray-600">{u.email}</p>
              <p className="text-sm capitalize">
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
          </div>
        ))}
      </div>

      {/* ================= DESKTOP VIEW (TABLE) ================= */}
      <div className="hidden sm:block bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-blue-600 text-white">
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
              <tr key={u._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{idx + 1}</td>
                <td className="py-3 px-4">
                  <img
                    src={u.profilePic || "https://via.placeholder.com/40"}
                    className="w-10 h-10 rounded-full"
                  />
                </td>
                <td className="py-3 px-4">{u.name}</td>
                <td className="py-3 px-4">{u.email}</td>
                <td className="py-3 px-4 capitalize">
                  {u.role || "Customer"}
                </td>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MODAL ================= */}
      {modalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm p-6 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-3 right-3 text-xl font-bold"
            >
              ×
            </button>

            <div className="flex flex-col items-center gap-3">
              <img
                src={
                  selectedUser.profilePic ||
                  "https://via.placeholder.com/80"
                }
                className="w-20 h-20 rounded-full"
              />
              <h2 className="text-xl font-bold">{selectedUser.name}</h2>
              <p>{selectedUser.email}</p>
              <p className="capitalize">
                Role: {selectedUser.role || "Customer"}
              </p>
              <p>Phone: {selectedUser.phone || "N/A"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
