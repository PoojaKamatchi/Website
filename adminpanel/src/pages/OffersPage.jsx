import { useEffect, useState } from "react";
import axios from "axios";
import OfferForm from "./OfferForm";  // <-- FIXED IMPORT

export default function OffersPage() {
  const API_URL = "http://localhost:5000";
  const [offers, setOffers] = useState([]);

  const fetchOffers = async () => {
    const res = await axios.get(`${API_URL}/api/offers`);
    setOffers(res.data);
  };

  const toggleActive = async (id, currentStatus) => {
    await axios.put(`${API_URL}/api/offers/${id}`, {
      isActive: !currentStatus,
    });
    fetchOffers();
  };

  const deleteOffer = async (id) => {
    await axios.delete(`${API_URL}/api/offers/${id}`);
    fetchOffers();
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
      <h1 className="text-3xl font-bold mb-6">Manage Offers</h1>

      {/* Add Offer Form */}
      <OfferForm API_URL={API_URL} onSuccess={fetchOffers} />

      {/* Offer List */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {offers.map((offer) => (
          <div
            key={offer._id}
            className="bg-white p-5 rounded-xl shadow border"
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
                className={`ml-2 px-3 py-1 rounded text-white ${
                  offer.isActive ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {offer.isActive ? "Active" : "Inactive"}
              </span>
            </p>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => toggleActive(offer._id, offer.isActive)}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                {offer.isActive ? "Deactivate" : "Activate"}
              </button>

              <button
                onClick={() => deleteOffer(offer._id)}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
