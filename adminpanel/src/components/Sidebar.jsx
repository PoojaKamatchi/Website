import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  CubeIcon,
  PlusCircleIcon,
  ShoppingCartIcon,
  UserIcon,
  TagIcon,
  UserPlusIcon,
  GiftIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

const menuItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: HomeIcon },
  { name: "Products", path: "/admin/products", icon: CubeIcon },
  { name: "Add Product", path: "/admin/products/add", icon: PlusCircleIcon },
  { name: "Orders", path: "/admin/orders", icon: ShoppingCartIcon },
  { name: "Users", path: "/admin/users", icon: UserIcon },
  { name: "Add Category", path: "/admin/add-category", icon: TagIcon },
  
  { name: "Offers", path: "/admin/offers", icon: GiftIcon },
  { name: "Contact Page", path: "/admin/contact", icon: PhoneIcon },
];

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // 🔒 Disable body scroll when sidebar open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <>
      {/* ================= MOBILE HEADER ================= */}
      <div className="lg:hidden fixed top-0 left-0 w-full h-14 bg-blue-800 text-white flex items-center justify-between px-4 z-40 shadow">
        <span className="font-bold text-lg">Admin Panel</span>
        <button
          onClick={() => setIsOpen(true)}
          className="text-2xl focus:outline-none"
        >
          ☰
        </button>
      </div>

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-blue-800 text-white
        transform transition-transform duration-300 z-50 shadow-xl
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static`}
      >
        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-center h-16 border-b border-blue-700 text-xl font-semibold">
          Admin Panel
        </div>

        {/* Menu */}
        <nav className="mt-16 lg:mt-6 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center py-3 px-4 rounded-lg transition
                ${
                  isActive(item.path)
                    ? "bg-blue-700 shadow"
                    : "hover:bg-blue-700"
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 w-full text-center py-3 text-sm bg-blue-900 border-t border-blue-700">
          © 2025 Admin Panel
        </div>
      </aside>

      {/* ================= OVERLAY ================= */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

export default Sidebar;
