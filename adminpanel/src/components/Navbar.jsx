import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <div className="bg-white shadow p-4 flex justify-between items-center fixed w-full z-10">
      <h1 className="text-xl font-bold">Admin Panel</h1>
      <div className="space-x-4">
        <Link to="/admin/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
        <Link to="/admin/products" className="text-gray-700 hover:text-blue-600">Products</Link>
        <Link to="/admin/orders" className="text-gray-700 hover:text-blue-600">Orders</Link>
        <Link to="/admin/users" className="text-gray-700 hover:text-blue-600">Users</Link>
        <button
          onClick={handleLogout}
          className="text-red-600 font-medium hover:text-red-800"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
