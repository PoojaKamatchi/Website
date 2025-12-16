import { useEffect, useState } from "react";
import axios from "axios";
import OfferForm from "./OfferForm";

const API_URL = import.meta.env.VITE_API_URL;

export default function OffersPage() {
  const [offers, setOffers] = useState([]);

  const fetchOffers = async () => {
    const res = await axios.get(`${API_URL}/api/offers`);
    setOffers(res.data);
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const getImage = (img) => {
    if (!img) return null;
    if (img.startsWith("http")) return img;
    return `${API_URL}${img}`;
  };

  return (
    <div className="p-10">
      <OfferForm onSuccess={fetchOffers} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {offers.map((o) => (
          <div key={o._id} className="bg-white p-4 rounded-xl shadow">
            <h2 className="font-bold">{o.title}</h2>
            <p>{o.discount}% OFF</p>
            {o.image && (
              <img src={getImage(o.image)} className="h-40 mt-2" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
