import { useEffect, useState } from "react";
import axios from "axios";

export default function OffersSection({ addToCart, navigate }) {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/offers/active/list`);
        setOffers(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching offers:", err.response || err);
        setOffers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, [API_URL]);

  if (loading)
    return (
      <section className="py-12 text-center text-gray-600">
        Loading offers...
      </section>
    );

  if (offers.length === 0)
    return (
      <section className="py-12 text-center text-gray-600">
        No special offers available right now.
      </section>
    );

  return (
    <section className="py-12 relative fire-border">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-gray-800">
          🌟 Special Offers for You
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {offers.map((offer, index) => {
            const imageSrc = offer.image?.startsWith("http")
              ? offer.image
              : `${API_URL}${offer.image}`;

            return (
              <div
                key={offer._id}
                className="relative rounded-2xl overflow-hidden shadow-lg animate-fadeIn"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animationFillMode: "forwards",
                }}
              >
                {/* HOT Ribbon */}
                <div className="absolute top-0 left-0 bg-red-500 text-white px-2 py-1 text-xs sm:text-sm font-bold rotate-45 transform -translate-x-4 -translate-y-4 shadow-lg z-20">
                  HOT
                </div>

                <div className="relative bg-white rounded-2xl p-4 sm:p-5 space-y-3 sm:space-y-4 z-10">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={offer.title}
                      className="w-full h-36 sm:h-48 object-cover rounded-xl"
                    />
                  ) : (
                    <div className="w-full h-36 sm:h-48 bg-gray-200 flex items-center justify-center rounded-xl text-gray-400 text-sm">
                      No Image
                    </div>
                  )}
                  <h3 className="text-lg sm:text-xl font-semibold truncate">{offer.title}</h3>
                  <p className="text-gray-600 text-sm sm:text-base truncate">{offer.description}</p>
                  <span className="inline-block px-2 py-1 text-xs sm:text-sm bg-green-600 text-white rounded-full font-medium">
                    {offer.discount}% OFF
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { 
          from { opacity: 0; transform: translateY(20px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        .animate-fadeIn { opacity: 0; animation: fadeIn 0.6s ease forwards; }

        /* Fire rotating border around section */
        .fire-border {
          position: relative;
          padding: 3rem 1rem;
        }
        .fire-border::before {
          content: '';
          position: absolute;
          top: -6px;
          left: -6px;
          right: -6px;
          bottom: -6px;
          border-radius: 20px;
          background: conic-gradient(
            from 0deg,
            #ff4d4d,
            #ffcc00,
            #ff4d4d,
            #ff6600,
            #ff4d4d
          );
          animation: rotateFire 3s linear infinite;
          z-index: 0;
        }
        .fire-border > div {
          position: relative; 
          z-index: 10;
        }
        @keyframes rotateFire {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 640px) {
          .fire-border::before {
            top: -4px;
            left: -4px;
            right: -4px;
            bottom: -4px;
          }
        }
      `}</style>
    </section>
  );
}
