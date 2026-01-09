import { useEffect, useState } from "react";
import axios from "axios";
import OfferForm from "./OfferForm";

const API_URL = import.meta.env.VITE_API_URL;

export default function OffersPage() {
  const [offers, setOffers] = useState([]);

  const fetchOffers = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/offers`);
      setOffers(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch offers");
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const getImage = (img) => {
    if (!img) return null;
    if (img.startsWith("http")) return img; // external URL
    return `${API_URL}${img}`; // uploaded file
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this offer?")) return;
    try {
      await axios.delete(`${API_URL}/api/offers/${id}`);
      fetchOffers(); // refresh list
    } catch (err) {
      console.error(err);
      alert("Failed to delete offer");
    }
  };

  return (
    <div className="p-4 sm:p-10 bg-gray-50 min-h-screen">
      {/* Add offer form */}
      <OfferForm onSuccess={fetchOffers} />

      {/* Offers list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {offers.map((o) => (
          <div key={o._id} className="bg-white p-4 rounded-xl shadow relative">
            <h2 className="font-bold text-lg">{o.title}</h2>
            <p className="text-blue-600 font-semibold">{o.discount}% OFF</p>
            {o.image && (
              <img
                src={getImage(o.image)}
                alt={o.title}
                className="h-40 w-full object-cover mt-2 rounded"
              />
            )}
            <button
              onClick={() => handleDelete(o._id)}
              className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
