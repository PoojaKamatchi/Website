import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/users";

  const [form, setForm] = useState({ name: "", email: "", password: "", otp: "" });
  const [step, setStep] = useState("register"); // register | verify

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) return toast.error("All fields required");
    try {
      await axios.post(`${API_URL}/register`, { name: form.name, email: form.email, password: form.password });
      toast.success("OTP sent to your email");
      setStep("verify");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  const handleVerify = async () => {
    if (!form.email || !form.otp) return toast.error("Email & OTP required");
    try {
      await axios.post(`${API_URL}/verify-otp`, { email: form.email, otp: form.otp });
      toast.success("Email verified! You can login now");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <ToastContainer />
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center">{step === "register" ? "Register" : "Verify OTP"}</h2>
        {step === "register" && (
          <>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" className="w-full p-2 border rounded" />
            <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded" />
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" className="w-full p-2 border rounded" />
            <button onClick={handleRegister} className="w-full py-2 bg-indigo-600 text-white rounded">Register</button>
          </>
        )}
        {step === "verify" && (
          <>
            <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded" />
            <input name="otp" value={form.otp} onChange={handleChange} placeholder="Enter OTP" className="w-full p-2 border rounded" />
            <button onClick={handleVerify} className="w-full py-2 bg-green-600 text-white rounded">Verify OTP</button>
          </>
        )}
      </div>
    </div>
  );
}
