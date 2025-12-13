import React, { useState, useEffect } from "react";
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
  const [otpTimer, setOtpTimer] = useState(0);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    otp: "",
    userId: "",
    newPassword: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value.trim() });

  const handleAuth = async () => {
    try {
      if (mode === "login") {
        if (!form.email || !form.password)
          return toast.error("Email & Password required");

        const res = await axios.post(`${API_URL}/api/auth/login`, {
          email: form.email,
          password: form.password,
        });

        localStorage.setItem("authToken", res.data.token);
        localStorage.setItem("userName", res.data.user?.name);
        toast.success("Login successful!");
        navigate("/");
      }

      if (mode === "register") {
        if (!form.name || !form.email || !form.password)
          return toast.error("All fields required");

        const res = await axios.post(`${API_URL}/api/auth/register`, {
          name: form.name,
          email: form.email,
          password: form.password,
        });

        toast.success("OTP sent!");
        setMode("otp");
        setOtpTimer(600);
        setForm({ ...form, userId: res.data.userId });
      }

      if (mode === "forgot") {
        if (!form.email) return toast.error("Enter email");

        const res = await axios.post(`${API_URL}/api/auth/forgot-password`, {
          email: form.email,
        });

        toast.success("OTP sent!");
        setMode("reset");
        setOtpTimer(600);
        setForm({ ...form, userId: res.data.userId });
      }

      if (mode === "otp") {
        if (!form.otp) return toast.error("Enter OTP");

        const res = await axios.post(`${API_URL}/api/auth/verify-otp`, {
          userId: form.userId,
          otp: form.otp,
        });

        localStorage.setItem("authToken", res.data.token);
        toast.success("OTP Verified!");
        navigate("/");
      }

      if (mode === "reset") {
        if (!form.otp || !form.newPassword)
          return toast.error("OTP & new password required");

        await axios.put(`${API_URL}/api/auth/reset-password`, {
          userId: form.userId,
          otp: form.otp,
          newPassword: form.newPassword,
        });

        toast.success("Password reset!");
        setMode("login");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  useEffect(() => {
    let t;
    if (otpTimer > 0) t = setInterval(() => setOtpTimer((n) => n - 1), 1000);
    return () => clearInterval(t);
  }, [otpTimer]);

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(
      2,
      "0"
    )}`;

  return (
    <div className="relative w-full h-screen overflow-hidden">

      {/* Background Video */}
      <video
        src={bgVideo}
        autoPlay
        loop
        muted
        className="absolute w-full h-full object-cover brightness-[0.45]"
      />

      <ToastContainer />

      {/* MAIN CONTAINER */}
      <div className="relative z-10 w-full h-full flex items-center justify-center px-4">

        {/* MAIN CARD */}
        <div className="
          w-full max-w-5xl
          bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden
          flex flex-col md:flex-row
        ">

          {/* LEFT – FORM */}
          <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-white text-center mb-6">
              {mode === "register"
                ? "Create Account"
                : mode === "login"
                ? "Welcome Back"
                : mode === "otp"
                ? "Enter OTP"
                : mode === "forgot"
                ? "Forgot Password"
                : "Reset Password"}
            </h2>

            {/* FORM FIELDS */}
            <div className="flex flex-col gap-4">
              {(mode === "login" || mode === "register" || mode === "forgot") && (
                <>
                  {mode === "register" && (
                    <input
                      name="name"
                      placeholder="Full Name"
                      value={form.name}
                      onChange={handleChange}
                      className="py-3 px-4 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  )}

                  <input
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="py-3 px-4 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />

                  {(mode === "login" || mode === "register") && (
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={form.password}
                      onChange={handleChange}
                      className="py-3 px-4 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  )}

                  <button
                    onClick={handleAuth}
                    className="mt-2 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors font-semibold text-white"
                  >
                    {mode === "login"
                      ? "Login"
                      : mode === "register"
                      ? "Register"
                      : "Send OTP"}
                  </button>
                </>
              )}

              {(mode === "otp" || mode === "reset") && (
                <>
                  <input
                    name="otp"
                    placeholder="OTP"
                    value={form.otp}
                    onChange={handleChange}
                    className="py-3 px-4 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />

                  {mode === "reset" && (
                    <input
                      type="password"
                      name="newPassword"
                      placeholder="New Password"
                      value={form.newPassword}
                      onChange={handleChange}
                      className="py-3 px-4 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  )}

                  <p className="text-white text-sm mb-2">
                    Expires in: {formatTime(otpTimer)}
                  </p>

                  <button
                    onClick={handleAuth}
                    className="py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors font-semibold text-white"
                  >
                    {mode === "otp" ? "Verify OTP" : "Reset Password"}
                  </button>
                </>
              )}
            </div>

            {/* Links */}
            <div className="text-center text-white mt-4 space-y-1">
              {mode !== "login" && (
                <p className="link cursor-pointer" onClick={() => setMode("login")}>
                  Login
                </p>
              )}
              {mode !== "register" && (
                <p className="link cursor-pointer" onClick={() => setMode("register")}>
                  Register
                </p>
              )}
              {mode !== "forgot" && (
                <p className="link cursor-pointer" onClick={() => setMode("forgot")}>
                  Forgot Password?
                </p>
              )}
            </div>
          </div>

          {/* RIGHT – LOGO + TEXT */}
          <div className="
            w-full md:w-1/2
            bg-white/10 p-8 md:p-10 
            flex flex-col items-center justify-center
            text-white
          ">
            <img
              src={logo}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full shadow-xl mb-6 border-4 border-white/30"
            />

            <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide text-center">
              Welcome to Life Gain Herbal Products
            </h1>

            <p className="mt-4 text-center text-white/80 text-base md:text-lg">
              Trusted medical essentials delivered fast and safe 💊✨
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
