import React, { useEffect, useState } from "react";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
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
      setFilteredUsers(res.data || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      alert("Failed to fetch users. Please login again.");
      localStorage.removeItem("adminToken");
      window.location.href = "/login";
    } finally {
      setLoading(false);
    }
  };

  const openModal = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setModalOpen(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search & role
  useEffect(() => {
    let temp = [...users];
    if (search)
      temp = temp.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      );
    if (roleFilter)
      temp = temp.filter((u) => (u.role || "Customer") === roleFilter);
    setFilteredUsers(temp);
  }, [search, roleFilter, users]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen font-semibold text-lg">
        Loading users...
      </div>
    );

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Users</h1>

      {/* Search & Filter */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded shadow-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="customer">Customer</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow-lg">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-6">#</th>
              <th className="py-3 px-6">Avatar</th>
              <th className="py-3 px-6">Name</th>
              <th className="py-3 px-6">Email</th>
              <th className="py-3 px-6">Role</th>
              <th className="py-3 px-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u, idx) => (
              <tr
                key={u._id}
                className="border-b hover:bg-gray-50 transition cursor-pointer"
              >
                <td className="py-3 px-6">{idx + 1}</td>
                <td className="py-3 px-6">
                  <img
                    src={u.profilePic || "https://via.placeholder.com/40?text=U"}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                </td>
                <td className="py-3 px-6">{u.name}</td>
                <td className="py-3 px-6">{u.email}</td>
                <td className="py-3 px-6 capitalize">{u.role || "Customer"}</td>
                <td className="py-3 px-6">
                  <button
                    onClick={() => openModal(u)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                  >
                    View Profile
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Profile Modal */}
      {modalOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
            >
              ×
            </button>
            <div className="flex flex-col items-center gap-4">
              <img
                src={selectedUser.profilePic || "https://via.placeholder.com/80?text=U"}
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover border-2 border-blue-400"
              />
              <h2 className="text-2xl font-bold">{selectedUser.name}</h2>
              <p className="text-gray-600">{selectedUser.email}</p>
              <p className="text-gray-600 capitalize">
                Role: {selectedUser.role || "Customer"}
              </p>
              <p className="text-gray-600">
                Phone: {selectedUser.phone || "N/A"}
              </p>
              <p className="text-gray-600 text-center">
                Address:{" "}
                {selectedUser.address
                  ? `${selectedUser.address.street || ""}, ${selectedUser.address.city || ""}, ${selectedUser.address.state || ""} - ${selectedUser.address.pincode || ""}`
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
