import React, { useState, useEffect } from "react";

export default function AdminContact() {
  const [contactInfo, setContactInfo] = useState({
    title: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    timings: "",
    whatsapp: "",
    emergency: "",
    services: [],
  });

  const [savedInfo, setSavedInfo] = useState(null);

  // Fetch existing contact info
  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/contact");
        const data = await res.json();
        if (data) {
          setContactInfo(data);
          setSavedInfo(data);
        }
      } catch (error) {
        console.error("Error loading contact info:", error);
      }
    };
    fetchAdminInfo();
  }, []);

  const handleChange = (e) => {
    setContactInfo({ ...contactInfo, [e.target.name]: e.target.value });
  };

  const handleServicesChange = (e) => {
    setContactInfo({ ...contactInfo, services: e.target.value.split(",") });
  };

  // Save contact info
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/admin/contact", {
        method: "POST", // or PUT depending on backend
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactInfo),
      });
      const data = await res.json();
      alert("Contact info updated!");
      setSavedInfo(data); // update saved info to display
    } catch (error) {
      console.error("Error saving contact info:", error);
    }
  };

  return (
    <div className="p-10 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Admin Contact Page Control</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={contactInfo.title}
          onChange={handleChange}
          placeholder="Page Title"
          className="border p-2 w-full rounded"
        />

        <textarea
          name="description"
          value={contactInfo.description}
          onChange={handleChange}
          placeholder="Page Description"
          className="border p-2 w-full rounded"
        />

        <input
          name="address"
          value={contactInfo.address}
          onChange={handleChange}
          placeholder="Address"
          className="border p-2 w-full rounded"
        />

        <input
          name="phone"
          value={contactInfo.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          className="border p-2 w-full rounded"
        />

        <input
          name="email"
          value={contactInfo.email}
          onChange={handleChange}
          placeholder="Email ID"
          className="border p-2 w-full rounded"
        />

        <input
          name="timings"
          value={contactInfo.timings}
          onChange={handleChange}
          placeholder="Working Hours / Timings"
          className="border p-2 w-full rounded"
        />

        <input
          name="whatsapp"
          value={contactInfo.whatsapp}
          onChange={handleChange}
          placeholder="WhatsApp Number"
          className="border p-2 w-full rounded"
        />

        <input
          name="emergency"
          value={contactInfo.emergency}
          onChange={handleChange}
          placeholder="Emergency Contact"
          className="border p-2 w-full rounded"
        />

        <textarea
          name="services"
          value={contactInfo.services.join(",")}
          onChange={handleServicesChange}
          placeholder="Services (comma separated)"
          className="border p-2 w-full rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
        >
          Save Contact Info
        </button>
      </form>

      {/* Saved Contact Info Preview */}
      {savedInfo && (
        <div className="mt-10 p-6 border rounded bg-gray-50 shadow">
          <h3 className="text-xl font-bold mb-4">Saved Contact Info</h3>
          <p><strong>Title:</strong> {savedInfo.title || "Not set"}</p>
          <p><strong>Description:</strong> {savedInfo.description || "Not set"}</p>
          <p><strong>Address:</strong> {savedInfo.address || "Not set"}</p>
          <p><strong>Phone:</strong> {savedInfo.phone || "Not set"}</p>
          <p><strong>Email:</strong> {savedInfo.email || "Not set"}</p>
          <p><strong>Timings:</strong> {savedInfo.timings || "Not set"}</p>
          <p><strong>WhatsApp:</strong> {savedInfo.whatsapp || "Not set"}</p>
          <p><strong>Emergency:</strong> {savedInfo.emergency || "Not set"}</p>
          <p><strong>Services:</strong> {savedInfo.services?.join(", ") || "Not set"}</p>
        </div>
      )}
    </div>
  );
}
