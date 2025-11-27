import React from "react";

export default function ReviewsPage() {
  const reviews = [
    { id: 1, product: "Wireless Earbuds", rating: 5, comment: "Excellent sound quality!" },
    { id: 2, product: "Smart Watch", rating: 4, comment: "Good battery life and design." },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-50 to-blue-100 p-8">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">My Reviews</h2>

      <div className="max-w-3xl mx-auto">
        {reviews.map((r) => (
          <div key={r.id} className="bg-white shadow-md rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-lg">{r.product}</h3>
            <p className="text-yellow-500">⭐ {r.rating}/5</p>
            <p className="text-gray-700">{r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
