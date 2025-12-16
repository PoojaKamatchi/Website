import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

export default function PaymentPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handlePayment = () => {
    setLoading(true);
    setTimeout(() => {
      toast.success("Payment successful!");
      navigate("/orders");
    }, 1500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-indigo-100">
      <ToastContainer />
      <button
        onClick={handlePayment}
        disabled={loading}
        className="bg-indigo-600 text-white px-6 py-3 rounded"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
}
