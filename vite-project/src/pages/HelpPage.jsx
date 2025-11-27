// src/pages/HelpPage.jsx
import React from "react";

export default function HelpPage() {
  return (
    <div className="p-6 md:p-12 bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-800">
        Need Help? We’re Here for You
      </h1>

      <section className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 text-blue-700">📞 Contact Us</h2>
        <p className="text-gray-700 mb-2">
          Have any questions or need support? Feel free to contact us!
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Customer Care Number:</strong> +91 98765 43210
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Email:</strong> support@hexgenai.com
        </p>
        <p className="text-gray-700">
          <strong>Working Hours:</strong> Monday - Saturday, 9:00 AM - 7:00 PM
        </p>
      </section>

      <section className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-blue-700">❓ Frequently Asked Questions</h2>

        <div className="mb-4">
          <h3 className="font-semibold text-gray-800">How can I track my order?</h3>
          <p className="text-gray-600">
            You can track your order by visiting the “My Orders” section after logging into your account.
          </p>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold text-gray-800">What if I receive a damaged product?</h3>
          <p className="text-gray-600">
            If your product is damaged or defective, please contact our support team within 24 hours for replacement.
          </p>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold text-gray-800">Can I cancel my order?</h3>
          <p className="text-gray-600">
            Orders can be canceled before dispatch. Once shipped, you can initiate a return request instead.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-800">Do you offer refunds?</h3>
          <p className="text-gray-600">
            Yes! Refunds are processed within 5–7 business days once your return is approved.
          </p>
        </div>
      </section>
    </div>
  );
}
