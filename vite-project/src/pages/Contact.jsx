import React, { useState, useEffect } from "react";

export default function Contact() {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/contact");
        const data = await res.json();
        setInfo(data);
      } catch (error) {
        console.error("Failed to fetch contact info:", error);
      }
    };
    fetchData();
  }, []);

  if (!info) return <p className="text-center p-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-green-100 px-6 pt-24 pb-16">
      <div className="max-w-4xl mx-auto bg-white/50 backdrop-blur-lg shadow-xl rounded-3xl p-10">

        <h1 className="text-4xl font-bold text-center mb-4">{info.title}</h1>
        <p className="text-center text-gray-700 mb-10 text-lg">{info.description}</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Left – Contact Details */}
          <div className="bg-white/80 p-8 rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">Contact Details</h2>
            <p><strong>📞 Phone:</strong> {info.phone}</p>
            <p><strong>📧 Email:</strong> {info.email}</p>
            <p><strong>📍 Address:</strong> {info.address}</p>
            <p><strong>🕒 Timings:</strong> {info.timings}</p>

            <div className="mt-6 flex gap-4">
              {info.phone && <a href={`tel:${info.phone}`} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Call Now</a>}
              {info.whatsapp && <a href={`https://wa.me/${info.whatsapp}`} className="bg-green-600 text-white px-4 py-2 rounded-lg">WhatsApp</a>}
              {info.emergency && <a href={`tel:${info.emergency}`} className="bg-red-600 text-white px-4 py-2 rounded-lg">Emergency</a>}
            </div>
          </div>

          {/* Right – Services */}
          <div className="bg-white/80 p-8 rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold text-green-700 mb-4">Our Medical Services</h2>
            <ul className="space-y-3 text-lg">
              {info.services?.map((srv, i) => (
                <li key={i}>✔ {srv}</li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
