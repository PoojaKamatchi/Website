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
        const res = await axios.post(
          `${API_URL}/api/users/forgot-password`,
          { email: form.email }
        );

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
      <video src={bgVideo} autoPlay loop muted className="absolute w-full h-full object-cover" />
      <ToastContainer />

      <div className="relative z-10 flex justify-center items-center h-full">
        <div className="bg-white/10 p-8 rounded-xl w-full max-w-md text-white">
          <h2 className="text-2xl text-center mb-4">
            {mode === "login"
              ? "Login"
              : mode === "register"
              ? "Register"
              : mode === "forgot"
              ? "Forgot Password"
              : "Reset Password"}
          </h2>

          {mode === "register" && (
            <input name="name" placeholder="Name" onChange={handleChange} />
          )}

          {(mode !== "reset") && (
            <input name="email" placeholder="Email" onChange={handleChange} />
          )}

          {(mode === "login" || mode === "register") && (
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
            />
          )}

          {mode === "reset" && (
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              onChange={handleChange}
            />
          )}

          <button onClick={handleAuth} className="w-full mt-4">
            Submit
          </button>

          <div className="text-center mt-3 text-sm">
            <p onClick={() => setMode("login")}>Login</p>
            <p onClick={() => setMode("register")}>Register</p>
            <p onClick={() => setMode("forgot")}>Forgot Password</p>
          </div>
        </div>
      </div>
    </div>
  );
}
