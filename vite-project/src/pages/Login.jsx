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

  /* ✅ DO NOT RESET userId */
  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      name: "",
      password: "",
      otp: "",
      newPassword: "",
    }));
  }, [mode]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAuth = async () => {
    try {
      /* ================= LOGIN ================= */
      if (mode === "login") {
        if (!form.email || !form.password)
          return toast.error("Email & Password required");

        const res = await axios.post(`${API_URL}/api/users/login`, {
          email: form.email,
          password: form.password,
        });

        localStorage.setItem("authToken", res.data.token);
        localStorage.setItem("userName", res.data.user.name);

        toast.success("Login successful!");
        navigate("/");
      }

      /* ================= REGISTER ================= */
      if (mode === "register") {
        if (!form.name || !form.email || !form.password)
          return toast.error("All fields required");

        const res = await axios.post(`${API_URL}/api/users/register-otp`, {
          name: form.name,
          email: form.email,
          password: form.password,
        });

        toast.success("OTP sent to your email!");
        setForm((prev) => ({ ...prev, userId: res.data.userId }));
        setOtpTimer(600);
        setMode("verify-register-otp");
      }

      /* ================= VERIFY REGISTER OTP ================= */
      if (mode === "verify-register-otp") {
        if (!form.otp || !form.userId)
          return toast.error("OTP or User ID missing");

        const res = await axios.post(
          `${API_URL}/api/users/verify-register-otp`,
          {
            userId: form.userId,
            otp: form.otp,
          }
        );

        localStorage.setItem("authToken", res.data.token);
        localStorage.setItem("userName", res.data.user.name);

        toast.success("Registration successful!");
        navigate("/");
      }

      /* ================= FORGOT PASSWORD ================= */
      if (mode === "forgot") {
        if (!form.email) return toast.error("Enter email");

        const res = await axios.post(`${API_URL}/api/users/forgot-password`, {
          email: form.email,
        });

        toast.success("OTP sent to your email!");
        setForm((prev) => ({ ...prev, userId: res.data.userId }));
        setOtpTimer(600);
        setMode("otp");
      }

      /* ================= VERIFY RESET OTP ================= */
      if (mode === "otp") {
        if (!form.otp || !form.userId)
          return toast.error("OTP or User ID missing");

        await axios.post(`${API_URL}/api/users/verify-otp`, {
          userId: form.userId,
          otp: form.otp,
        });

        toast.success("OTP verified!");
        setMode("reset");
      }

      /* ================= RESET PASSWORD ================= */
      if (mode === "reset") {
        if (!form.newPassword)
          return toast.error("Enter new password");

        await axios.put(`${API_URL}/api/users/reset-password`, {
          userId: form.userId,
          otp: form.otp,
          newPassword: form.newPassword,
        });

        toast.success("Password reset successful!");
        setMode("login");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  /* ================= OTP TIMER ================= */
  useEffect(() => {
    if (!otpTimer) return;
    const timer = setInterval(() => setOtpTimer((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [otpTimer]);

  const formatTime = (sec) =>
    `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(
      sec % 60
    ).padStart(2, "0")}`;

  return (
    <div className="relative w-full h-screen overflow-hidden text-white">
      <video
        src={bgVideo}
        autoPlay
        loop
        muted
        className="absolute w-full h-full object-cover brightness-[0.45]"
      />

      <ToastContainer />

      <div className="relative z-10 w-full h-full flex items-center justify-center px-4">
        <div className="w-full max-w-5xl bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl flex flex-col md:flex-row">

          {/* LEFT FORM */}
          <div className="w-full md:w-1/2 p-8">
            <h2 className="text-3xl font-bold text-center mb-6">
              {mode === "login"
                ? "Welcome Back"
                : mode === "register"
                ? "Create Account"
                : mode === "verify-register-otp"
                ? "Verify OTP"
                : mode === "forgot"
                ? "Forgot Password"
                : mode === "otp"
                ? "Enter OTP"
                : "Reset Password"}
            </h2>

            <div className="flex flex-col gap-4">
              {mode === "register" && (
                <input
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  className="input border border-white/70 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}

              {(mode === "login" ||
                mode === "register" ||
                mode === "forgot") && (
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  className="input border border-white/70 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}

              {(mode === "login" || mode === "register") && (
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="input border border-white/70 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}

              {(mode === "verify-register-otp" || mode === "otp") && (
                <input
                  name="otp"
                  placeholder="OTP"
                  value={form.otp}
                  onChange={handleChange}
                  className="input border border-white/70 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}

              {mode === "reset" && (
                <input
                  type="password"
                  name="newPassword"
                  placeholder="New Password"
                  value={form.newPassword}
                  onChange={handleChange}
                  className="input border border-white/70 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}

              {otpTimer > 0 && (
                <p className="text-sm text-center">
                  Expires in: {formatTime(otpTimer)}
                </p>
              )}

              <button onClick={handleAuth} className="btn">
                {mode === "login"
                  ? "Login"
                  : mode === "register"
                  ? "Register"
                  : mode === "forgot"
                  ? "Send OTP"
                  : mode === "reset"
                  ? "Reset Password"
                  : "Verify OTP"}
              </button>
            </div>

            {/* MODE SWITCH */}
            <div className="text-center mt-4 space-y-1 text-sm">
              {mode !== "login" && (
                <p className="cursor-pointer" onClick={() => setMode("login")}>
                  Login
                </p>
              )}
              {mode !== "register" && (
                <p className="cursor-pointer" onClick={() => setMode("register")}>
                  Create Account
                </p>
              )}
              {mode !== "forgot" && (
                <p className="cursor-pointer" onClick={() => setMode("forgot")}>
                  Forgot Password?
                </p>
              )}
            </div>
          </div>

          {/* RIGHT LOGO */}
          <div className="w-full md:w-1/2 p-10 flex flex-col items-center justify-center">
            <img src={logo} className="w-36 h-36 rounded-full mb-6" />
            <h1 className="text-3xl font-bold text-center">
              Life Gain Herbal Products
            </h1>
          </div>

        </div>
      </div>
    </div>
  );
}
