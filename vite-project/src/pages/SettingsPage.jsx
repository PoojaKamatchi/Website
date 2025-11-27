import React from "react";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-cyan-100 p-8">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Account Settings</h2>

      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-700 mb-4">Manage your account preferences here:</p>

        <ul className="space-y-3 text-gray-700">
          <li>🛡️ Change Password</li>
          <li>📱 Update Mobile Number</li>
          <li>🏠 Manage Addresses</li>
          <li>💬 Manage Reviews</li>
          <li>⚙️ Privacy and Notification Preferences</li>
        </ul>
      </div>
    </div>
  );
}
