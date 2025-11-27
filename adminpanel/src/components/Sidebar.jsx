import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  CubeIcon,
  PlusCircleIcon,
  ShoppingCartIcon,
  UserIcon,
  ChartBarIcon,
  TagIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";

const menuItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: <HomeIcon className="w-5 h-5 mr-3" /> },
  { name: "Products", path: "/admin/products", icon: <CubeIcon className="w-5 h-5 mr-3" /> },
  { name: "Add Product", path: "/admin/products/add", icon: <PlusCircleIcon className="w-5 h-5 mr-3" /> },
  { name: "Orders", path: "/admin/orders", icon: <ShoppingCartIcon className="w-5 h-5 mr-3" /> },
  { name: "Users", path: "/admin/users", icon: <UserIcon className="w-5 h-5 mr-3" /> },
  { name: "Reports", path: "/admin/reports", icon: <ChartBarIcon className="w-5 h-5 mr-3" /> },
  { name: "Add Category", path: "/admin/add-category", icon: <TagIcon className="w-5 h-5 mr-3" /> },
  { name: "Add Admin", path: "/admin/add-admin", icon: <UserPlusIcon className="w-5 h-5 mr-3" /> },
];

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden flex justify-between items-center bg-blue-800 text-white p-4 shadow-md">
        <span className="font-bold text-lg">Admin Panel</span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-2xl focus:outline-none"
        >
          ☰
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 h-screen bg-blue-800 text-white transform transition-transform duration-300 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:w-64 w-64 z-50 shadow-2xl flex flex-col justify-between`}
      >
        {/* Header */}
        <div className="hidden lg:flex items-center justify-center p-5 border-b border-blue-700 text-xl font-semibold">
          Admin Panel
        </div>

        {/* Menu Items */}
        <nav className="mt-6 space-y-1 px-3 flex-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center py-3 px-4 rounded-lg hover:bg-blue-700 transition
              ${location.pathname === item.path ? "bg-blue-700" : ""}`}
              onClick={() => setIsOpen(false)}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="text-center py-3 text-sm bg-blue-900 border-t border-blue-700">
          © 2025 Admin Panel
        </div>
      </aside>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}

export default Sidebar;
