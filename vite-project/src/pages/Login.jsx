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

        window.dispatchEvent(new Event("storage"));

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
        setMode("verify-register-otp");
        setOtpTimer(600);
        setForm({ ...form, userId: res.data.userId });
      }

      /* ================= VERIFY REGISTER OTP ================= */
      if (mode === "verify-register-otp") {
        if (!form.otp) return toast.error("Enter OTP");

        await axios.post(`${API_URL}/api/users/verify-register-otp`, {
          userId: form.userId,
          otp: form.otp,
        });

        toast.success("Registration verified! Please login.");
        setMode("login");
      }

      /* ================= FORGOT PASSWORD ================= */
      if (mode === "forgot") {
        if (!form.email) return toast.error("Enter email");

        const res = await axios.post(`${API_URL}/api/users/forgot-password`, {
          email: form.email,
        });

        toast.success("OTP sent to your email!");
        setMode("otp");
        setOtpTimer(600);
        setForm({ ...form, userId: res.data.userId });
      }

      /* ================= VERIFY RESET OTP ================= */
      if (mode === "otp") {
        if (!form.otp) return toast.error("Enter OTP");

        await axios.post(`${API_URL}/api/users/verify-otp`, {
          userId: form.userId,
          otp: form.otp,
        });

        toast.success("OTP verified! Set new password.");
        setMode("reset");
      }

      /* ================= RESET PASSWORD ================= */
      if (mode === "reset") {
        if (!form.newPassword) return toast.error("Enter new password");

        await axios.put(`${API_URL}/api/users/reset-password`, {
          userId: form.userId,
          otp: form.otp,
          newPassword: form.newPassword,
        });

        toast.success("Password reset successful!");
        setMode("login");
      }
    } catch (err) {
      console.log(err.response?.data);
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  /* ================= OTP TIMER ================= */
  useEffect(() => {
    let timer;
    if (otpTimer > 0) {
      timer = setInterval(() => setOtpTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [otpTimer]);

  const formatTime = (sec) =>
    `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(
      sec % 60
    ).padStart(2, "0")}`;

  return (
    <div className="relative w-full h-screen overflow-hidden text-white">
      {/* Background Video */}
      <video
        src={bgVideo}
        autoPlay
        loop
        muted
        className="absolute w-full h-full object-cover brightness-[0.45]"
      />

      <ToastContainer />

      <div className="relative z-10 w-full h-full flex items-center justify-center px-4">
        <div className="w-full max-w-5xl bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
          {/* LEFT FORM */}
          <div className="w-full md:w-1/2 p-8 md:p-10">
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
              {(mode === "login" ||
                mode === "register" ||
                mode === "forgot") && (
                <>
                  {mode === "register" && (
                    <input
                      name="name"
                      placeholder="Full Name"
                      value={form.name}
                      onChange={handleChange}
                      className="input"
                    />
                  )}

                  <input
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="input"
                  />

                  {(mode === "login" || mode === "register") && (
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={form.password}
                      onChange={handleChange}
                      className="input"
                    />
                  )}

                  <button onClick={handleAuth} className="btn">
                    {mode === "login"
                      ? "Login"
                      : mode === "register"
                      ? "Register"
                      : "Send OTP"}
                  </button>
                </>
              )}

              {(mode === "otp" ||
                mode === "reset" ||
                mode === "verify-register-otp") && (
                <>
                  <input
                    name="otp"
                    placeholder="OTP"
                    value={form.otp}
                    onChange={handleChange}
                    className="input"
                  />

                  {mode === "reset" && (
                    <input
                      type="password"
                      name="newPassword"
                      placeholder="New Password"
                      value={form.newPassword}
                      onChange={handleChange}
                      className="input"
                    />
                  )}

                  <p className="text-sm">Expires in: {formatTime(otpTimer)}</p>

                  <button onClick={handleAuth} className="btn">
                    {mode === "reset" ? "Reset Password" : "Verify OTP"}
                  </button>
                </>
              )}
            </div>

            <div className="text-center mt-4 space-y-1">
              {mode !== "login" && (
                <p className="cursor-pointer" onClick={() => setMode("login")}>
                  Login
                </p>
              )}
              {mode !== "register" && (
                <p className="cursor-pointer" onClick={() => setMode("register")}>
                  Register
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
            <img
              src={logo}
              className="w-36 h-36 rounded-full shadow-xl mb-6"
            />
            <h1 className="text-3xl font-bold text-center">
              Life Gain Herbal Products
            </h1>
            <p className="mt-4 text-center opacity-80">
              Trusted medical essentials delivered fast & safe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
