import { useEffect, useState } from "react";
import axios from "axios";
import OfferForm from "./OfferForm";

export default function OffersPage() {
  const API_URL = "http://localhost:5000";
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/offers`);
      setOffers(res.data);
    } catch (err) {
      console.error("Failed to fetch offers:", err);
      alert("Failed to fetch offers");
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id, currentStatus) => {
    try {
      await axios.put(`${API_URL}/api/offers/${id}`, {
        isActive: !currentStatus,
      });
      fetchOffers();
    } catch (err) {
      console.error("Failed to toggle status:", err);
      alert("Error updating offer status");
    }
  };

  const deleteOffer = async (id) => {
    if (!window.confirm("Are you sure you want to delete this offer?")) return;
    try {
      await axios.delete(`${API_URL}/api/offers/${id}`);
      fetchOffers();
    } catch (err) {
      console.error("Failed to delete offer:", err);
      alert("Error deleting offer");
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const getImageSrc = (imagePath) => {
    if (!imagePath) return null;
    return imagePath.startsWith("/uploads") ? `${API_URL}${imagePath}` : imagePath;
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Manage Offers</h1>

      {/* Add Offer Form */}
      <OfferForm API_URL={API_URL} onSuccess={fetchOffers} />

      {/* Loading */}
      {loading && <p className="text-center mt-4">⏳ Loading offers...</p>}

      {/* Offer List */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {offers.map((offer) => (
          <div
            key={offer._id}
            className="bg-white p-5 rounded-xl shadow border transition hover:scale-105"
          >
            <h2 className="text-xl font-semibold">{offer.title}</h2>
            <p className="mt-2 text-gray-500">{offer.description}</p>

            {offer.image && (
              <img
                src={getImageSrc(offer.image)}
                alt={offer.title}
                className="w-full h-40 object-cover rounded mt-3"
              />
            )}

            <p className="mt-3 font-bold text-lg">
              Discount: {offer.discount}%
            </p>

            <p className="mt-2">
              Status:
              <span
                className={`ml-2 px-3 py-1 rounded text-white font-semibold ${
                  offer.isActive ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {offer.isActive ? "Active" : "Inactive"}
              </span>
            </p>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => toggleActive(offer._id, offer.isActive)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
              >
                {offer.isActive ? "Deactivate" : "Activate"}
              </button>

              <button
                onClick={() => deleteOffer(offer._id)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {!loading && offers.length === 0 && (
          <p className="text-center text-gray-500 col-span-full mt-4">
            No offers available.
          </p>
        )}
      </div>
    </div>
  );
}
