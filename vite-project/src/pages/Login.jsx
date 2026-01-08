import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import logo from "../assets/logo Ecom.jpg";
import bgVideo from "../assets/video.mp4";

export default function Login() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [mode, setMode] = useState("login");
  const [userId, setUserId] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    newPassword: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAuth = async () => {
    try {
      if (mode === "login") {
        const res = await axios.post(`${API_URL}/api/users/login`, {
          email: form.email,
          password: form.password,
        });
        localStorage.setItem("authToken", res.data.token);
        localStorage.setItem("userName", res.data.user.name);
        toast.success("Login successful");
        navigate("/");
      }

      if (mode === "register") {
        const res = await axios.post(`${API_URL}/api/users/register`, form);
        localStorage.setItem("authToken", res.data.token);
        localStorage.setItem("userName", res.data.user.name);
        toast.success("Registration successful");
        navigate("/");
      }

      if (mode === "forgot") {
        const res = await axios.post(`${API_URL}/api/users/forgot-password`, {
          email: form.email,
        });
        setUserId(res.data.userId);
        toast.success("Proceed to reset password");
        setMode("reset");
      }

      if (mode === "reset") {
        await axios.put(`${API_URL}/api/users/reset-password`, {
          userId,
          newPassword: form.newPassword,
        });
        toast.success("Password reset successful");
        setMode("login");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  return (
    <div className="relative w-full h-screen">
      {/* Background Video */}
      <video
        src={bgVideo}
        autoPlay
        loop
        muted
        className="absolute w-full h-full object-cover brightness-50"
      />

      <ToastContainer />

      {/* Centered Card */}
      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 text-white">
          {/* Logo + Brand */}
          <div className="flex flex-col items-center mb-6">
            <img src={logo} alt="Logo" className="w-24 h-24 rounded-full mb-3" />
            <h1 className="text-2xl font-bold text-center text-green-400">
              Life Gain Herbal Products
            </h1>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-center mb-6">
            {mode === "login"
              ? "Welcome Back"
              : mode === "register"
              ? "Create Account"
              : mode === "forgot"
              ? "Forgot Password"
              : "Reset Password"}
          </h2>

          {/* Form */}
          <div className="flex flex-col gap-4">
            {mode === "register" && (
              <input
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="input-field"
              />
            )}

            {mode !== "reset" && (
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="input-field"
              />
            )}

            {(mode === "login" || mode === "register") && (
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="input-field"
              />
            )}

            {mode === "reset" && (
              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                value={form.newPassword}
                onChange={handleChange}
                className="input-field"
              />
            )}

            {/* Submit Button */}
            <button
              onClick={handleAuth}
              className="w-full py-3 bg-gradient-to-r from-green-400 to-green-600 rounded-xl text-white font-semibold shadow-lg hover:scale-105 transition-transform duration-200"
            >
              {mode === "login"
                ? "Login"
                : mode === "register"
                ? "Register"
                : mode === "forgot"
                ? "Proceed"
                : "Reset Password"}
            </button>
          </div>

          {/* Mode Switch */}
          <div className="mt-6 flex justify-center gap-4 text-sm opacity-80">
            <p
              onClick={() => setMode("login")}
              className="cursor-pointer hover:text-green-300 transition-colors"
            >
              Login
            </p>
            <p
              onClick={() => setMode("register")}
              className="cursor-pointer hover:text-green-300 transition-colors"
            >
              Register
            </p>
            <p
              onClick={() => setMode("forgot")}
              className="cursor-pointer hover:text-green-300 transition-colors"
            >
              Forgot Password
            </p>
          </div>
        </div>
      </div>

      {/* Custom Input Styles */}
      <style>
        {`
          .input-field {
            width: 100%;
            padding: 12px 16px;
            border-radius: 12px;
            border: 1px solid rgba(255,255,255,0.5);
            background: rgba(255,255,255,0.1);
            color: white;
            font-size: 16px;
            outline: none;
            transition: all 0.3s ease;
          }
          .input-field:focus {
            border-color: #34d399;
            background: rgba(255,255,255,0.2);
          }
        `}
      </style>
    </div>
  );
}
