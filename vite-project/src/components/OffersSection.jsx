import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function OffersSection() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/offers/active/list`);
        setOffers(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching offers:", err);
        setOffers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, [API_URL]);

  if (loading) {
    return (
      <section className="py-12 text-center text-gray-600">
        Loading offers...
      </section>
    );
  }

  if (offers.length === 0) {
    return (
      <section className="py-12 text-center text-gray-600">
        No special offers available right now.
      </section>
    );
  }

  return (
    <section className="py-14">
      {/* 🌈 SECTION BORDER HIGHLIGHT */}
      <div className="max-w-7xl mx-auto px-4 rounded-3xl
                      border-4 border-transparent
                      bg-gradient-to-r from-green-400 via-teal-400 to-blue-400
                      p-[3px]">
        <div className="bg-white rounded-3xl p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-gray-800">
            🩺 Special Medical Offers
          </h2>

          {/* OFFERS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer, index) => {
              const imageSrc = offer.image?.startsWith("http")
                ? offer.image
                : `${API_URL}${offer.image}`;

              const productId =
                offer.product?._id || offer.productId;

              return (
                <div
                  key={offer._id}
                  className="relative rounded-2xl p-[2px] animate-borderGlow"
                  style={{
                    animationDelay: `${index * 0.2}s`,
                  }}
                >
                  {/* 🌟 ANIMATED BORDER */}
                  <div className="absolute inset-0 rounded-2xl
                                  bg-gradient-to-r from-green-400 via-teal-400 to-blue-400
                                  opacity-60 blur-sm" />

                  {/* CARD BODY */}
                  <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg">
                    <div className="p-4 sm:p-5 space-y-3 sm:space-y-4">

                      {/* ✅ CLICK ONLY IMAGE */}
                      {imageSrc ? (
                        <img
                          src={imageSrc}
                          alt={offer.title}
                          onClick={() =>
                            productId && navigate(`/product/${productId}`)
                          }
                          className="w-full h-36 sm:h-48 object-cover rounded-xl
                                     cursor-pointer
                                     hover:scale-105
                                     transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-36 sm:h-48 bg-gray-200
                                        flex items-center justify-center
                                        rounded-xl text-gray-400 text-sm">
                          No Image
                        </div>
                      )}

                      <h3 className="text-lg sm:text-xl font-semibold truncate">
                        {offer.title}
                      </h3>

                      <p className="text-gray-600 text-sm sm:text-base truncate">
                        {offer.description}
                      </p>

                      <span className="inline-block px-3 py-1
                                       text-xs sm:text-sm
                                       bg-green-600 text-white
                                       rounded-full font-medium">
                        {offer.discount}% OFF
                      </span>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ✨ BORDER ANIMATION */}
      <style>{`
        @keyframes borderGlow {
          0%, 100% {
            opacity: 0.35;
          }
          50% {
            opacity: 0.85;
          }
        }

        .animate-borderGlow::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 1rem;
          animation: borderGlow 2.5s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
