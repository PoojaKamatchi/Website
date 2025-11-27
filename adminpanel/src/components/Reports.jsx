import React, { useState, useEffect } from "react";
import axios from "axios";

const Reports = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/reports", {
          headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
        });
        setReports(res.data);
      } catch (err) {
        console.error("Failed to fetch reports:", err);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Reports</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <div key={report.id} className="bg-white rounded-xl shadow-lg p-6 hover:scale-105 transition">
            <h2 className="text-xl font-semibold text-gray-700">{report.title}</h2>
            <p className="text-gray-500 mt-2">Created on: {report.date}</p>
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              View Report
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
