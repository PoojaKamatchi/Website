// src/pages/PrivacyPolicy.jsx
import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="p-6 md:p-12 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Privacy Policy
      </h1>

      <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-md text-gray-700 leading-relaxed">
        <p className="mb-4">
          At <strong>HexGenAI</strong>, we value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data when you use our platform.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-800">1. Information We Collect</h2>
        <p className="mb-4">
          We collect information such as your name, email address, contact number, shipping details, and payment information when you interact with our website or make a purchase.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-800">2. How We Use Your Information</h2>
        <p className="mb-4">
          We use your data to process orders, provide customer support, send order updates, and improve your overall experience. Occasionally, we may send promotional offers based on your preferences.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-800">3. Cookies</h2>
        <p className="mb-4">
          Our site uses cookies to enhance your browsing experience. You can control cookie preferences in your browser settings.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-800">4. Third-Party Sharing</h2>
        <p className="mb-4">
          We do not sell or trade your personal information. Data may be shared with trusted partners only for payment processing and delivery purposes.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-800">5. Your Rights</h2>
        <p className="mb-4">
          You have the right to access, update, or delete your personal information anytime by contacting our support team.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-800">6. Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy, please reach out to us at{" "}
          <strong>privacy@hexgenai.com</strong> or call us at{" "}
          <strong>+91 98765 43210</strong>.
        </p>
      </div>
    </div>
  );
}
