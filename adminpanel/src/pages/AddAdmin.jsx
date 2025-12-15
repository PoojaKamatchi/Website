import React, { useState } from "react";
import axios from "axios";

export default function AddAdmin() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setError("Admin login required");
        return;
      }

      const { data } = await axios.post(
        `${API_URL}/api/admin/register`,
        { name, email, password },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(data.message || "Admin added successfully!");
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Error adding admin");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto mt-10 bg-white rounded-xl shadow-lg lg:ml-64">
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">
        Add New Admin
      </h2>
      <form onSubmit={handleAddAdmin} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Add Admin
        </button>
      </form>
      {message && <p className="text-green-600 mt-4 text-center">{message}</p>}
      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
    </div>
  );
}
