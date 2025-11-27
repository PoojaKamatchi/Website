import React from "react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-cyan-100 p-8">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">About Us</h2>

      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 text-gray-700">
        <p>
          Welcome to <strong>HexGen AI Store</strong> – your trusted e-commerce destination for innovative and high-quality tech products.
        </p>
        <p className="mt-3">
          Our mission is to transform the way you shop online through intelligent automation, seamless user experiences, and cutting-edge AI integration.
        </p>
        <p className="mt-3">
          Founded in 2025, HexGenAI focuses on customer satisfaction, fast delivery, and smart shopping experiences.
        </p>
      </div>
    </div>
  );
}
