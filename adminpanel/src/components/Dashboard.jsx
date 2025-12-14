import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const cards = [
    { 
      title: "Products", 
      description: "Manage your product list", 
      path: "/admin/products", 
      icon: "🛍️", 
      color: "from-blue-500 to-indigo-600" 
    },

    { 
      title: "Add Category", 
      description: "Create new categories", 
      path: "/admin/add-category", 
      icon: "📂", 
      color: "from-teal-500 to-green-600" 
    },

    { 
      title: "Add Product", 
      description: "Add new products to store", 
      path: "/admin/products/add", 
      icon: "➕", 
      color: "from-green-400 to-emerald-500" 
    },

    { 
      title: "Orders", 
      description: "Track recent orders", 
      path: "/admin/orders", 
      icon: "📦", 
      color: "from-yellow-400 to-orange-500" 
    },

    { 
      title: "Users", 
      description: "See customer details", 
      path: "/admin/users", 
      icon: "👥", 
      color: "from-pink-500 to-rose-600" 
    },

    { 
      title: "Reports", 
      description: "View sales analytics", 
      path: "/admin/reports", 
      icon: "📊", 
      color: "from-red-500 to-rose-600" 
    },

    { 
      title: "Add Admin", 
      description: "Add a new admin", 
      path: "/admin/add-admin", 
      icon: "👤➕", 
      color: "from-purple-500 to-pink-500" 
    },

    { 
      title: "Contact Page", 
      description: "Edit contact info", 
      path: "/admin/contact", 
      icon: "📞", 
      color: "from-cyan-500 to-blue-500" 
    },

    // ✅ Added Offers card properly
    { 
      title: "Offers", 
      description: "Manage discount offers", 
      path: "/admin/offers", 
      icon: "🏷️", 
      color: "from-purple-500 to-indigo-500" 
    }
  ];

  return (
    <div className="p-6 min-h-screen bg-gray-100 lg:ml-64">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <Link
            to={card.path}
            key={index}
            className={`block bg-gradient-to-br ${card.color} text-white rounded-2xl shadow-lg p-6 text-center transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 animate-fadeIn`}
            style={{ animationDelay: `${index * 0.1}s`, animationFillMode: "forwards" }}
          >
            <div className="text-6xl mb-4">{card.icon}</div>
            <h2 className="text-xl font-semibold">{card.title}</h2>
            <p className="text-sm opacity-90 mt-2">{card.description}</p>
          </Link>
        ))}
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease forwards;
          }
        `}
      </style>
    </div>
  );
};

export default Dashboard;
