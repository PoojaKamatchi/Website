import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminLogin() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // ✅ STEP 1: REQUEST OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await axios.post(`${API_URL}/api/auth/admin/login`, {
        email,
        password,
      });

      setMessage(res.data.message || "OTP sent to email");
      setShowOtpField(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    }
  };

  // ✅ STEP 2: VERIFY OTP
  const handleVerifyOtp = async () => {
    if (!otp) {
      setError("Please enter OTP");
      return;
    }

    try {
      const res = await axios.post(
        `${API_URL}/api/auth/admin/verify-otp`,
        {
          email,
          otp,
        }
      );

      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("adminName", res.data.admin?.name);

      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-100 to-pink-100">
      <form
        onSubmit={handleRequestOtp}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">
          Admin Login
        </h2>

        {error && <p className="text-red-600 mb-3">{error}</p>}
        {message && <p className="text-green-600 mb-3">{message}</p>}

        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={showOtpField}
          className="w-full p-3 mb-4 border rounded-lg"
        />

        {!showOtpField && (
          <>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 mb-4 border rounded-lg"
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg"
            >
              Send OTP
            </button>
          </>
        )}

        {showOtpField && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 mb-4 border rounded-lg"
            />

            <button
              type="button"
              onClick={handleVerifyOtp}
              className="w-full bg-green-600 text-white py-3 rounded-lg"
            >
              Verify OTP
            </button>
          </>
        )}
      </form>
    </div>
  );
}
