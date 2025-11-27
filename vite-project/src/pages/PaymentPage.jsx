import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PaymentPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handlePayment = () => {
    setLoading(true);
    setTimeout(() => {
      toast.success("Payment successful!");
      setLoading(false);
      navigate("/orders");
    }, 1500); // simulate payment delay
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-indigo-700 mb-6">Complete Your Payment</h1>
        <p className="text-gray-600 mb-6">Click the button below to pay securely.</p>
        <button
          onClick={handlePayment}
          disabled={loading}
          className={`w-full py-2 rounded-lg text-white font-semibold transition duration-300 ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
}
