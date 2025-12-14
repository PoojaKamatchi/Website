import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Products from "./components/Products";
import AddProduct from "./pages/AddProduct";
import Orders from "./components/Orders";
import Users from "./components/Users";
import Reports from "./components/Reports";
import Login from "./pages/Login";
import AddCategory from "./pages/AddCategory";
import AddAdmin from "./pages/AddAdmin";
import AdminContact from "./pages/AdminContact";
import OfferForm from "./pages/OfferForm";
import OffersPage from "./pages/OffersPage";


// ---- Removed the problematic imports ----
// import AdminForgotPassword from "./pages/AdminForgotPassword";
// import AdminResetPassword from "./pages/AdminResetPassword";

function App() {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Router>
      <Routes>
        {/* Default Route → Admin Login */}
        <Route path="/" element={<Navigate to="/admin/login" />} />

        {/* Admin AUTH Pages */}
        <Route path="/admin/login" element={<Login />} />

        {/* ---- Removed the routes using removed imports ---- */}
        {/* <Route path="/admin/forgot-password" element={<AdminForgotPassword />} /> */}
        {/* <Route path="/admin/reset-password/:token" element={<AdminResetPassword />} /> */}

        {/* ADMIN PANEL LAYOUT */}
        <Route
          path="/admin/*"
          element={
            <div className="flex w-full min-h-screen">
              <Sidebar />
              <div className="flex-1 p-6 bg-gray-100">
                <Routes>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="products" element={<Products products={products} />} />
                  <Route
                    path="products/add"
                    element={
                      <AddProduct
                        onProductAdded={(newProduct) =>
                          setProducts((prev) => [...prev, newProduct])
                        }
                      />
                    }
                  />
                  <Route path="orders" element={<Orders />} />
                  <Route path="users" element={<Users />} />
                  <Route path="reports" element={<Reports />} />
                  <Route path="add-category" element={<AddCategory />} />
                  <Route path="add-admin" element={<AddAdmin />} />
                  <Route path="contact" element={<AdminContact />} />
<Route path="offers" element={<OffersPage />} />
<Route path="offers/add" element={<OfferForm />} />

                </Routes>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
