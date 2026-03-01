import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../components/CartContext";
import { useWishlist } from "../components/WishlistContext";
import axios from "axios";
import homeVideo from "../assets/home.mp4";
import OffersSection from "../components/OffersSection";

export default function Home() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const popularRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    Promise.all([
      axios.get(`${API_URL}/api/categories`),
      axios.get(`${API_URL}/api/products`)
    ])
      .then(([catRes, prodRes]) => {
        setCategories(catRes.data || []);
        setPopularProducts(prodRes.data || []);
      })
      .catch(() => {
        setCategories([]);
        setPopularProducts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const isWishlisted = (id) =>
    wishlist.some((item) => item._id === id);

  return (
    <div className="bg-[#f6faf7] font-sans text-gray-800">

      {/* ================= HERO ================= */}
      <section className="relative h-[75vh] flex items-center justify-center overflow-hidden">
        <video
          src={homeVideo}
          autoPlay
          loop
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/70 to-green-800/40" />

        <div className="relative z-10 text-center text-white px-6 max-w-3xl">
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Nurture Your Body. <br />
            <span className="text-green-300">Elevate Your Life.</span>
          </h1>

          <p className="text-lg text-green-100 mb-8">
            Carefully curated wellness essentials crafted for balance,
            energy, and daily vitality.
          </p>

          <button
            onClick={() =>
              popularRef.current?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-8 py-3 bg-green-400 hover:bg-green-500 text-green-900 font-semibold rounded-full shadow-lg transition"
          >
            Discover Essentials
          </button>
        </div>
      </section>

      <OffersSection />

      {/* ================= TRUST BADGES ================= */}
      <section className="py-16 bg-white text-center">
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto px-6">
          <div>
            <h3 className="text-xl font-semibold text-green-700">
              100% Natural
            </h3>
            <p className="text-gray-600 mt-2">
              Clean ingredients sourced with care.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-green-700">
              Quality Assured
            </h3>
            <p className="text-gray-600 mt-2">
              Tested and verified for safety & purity.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-green-700">
              Trusted by Customers
            </h3>
            <p className="text-gray-600 mt-2">
              Designed to support your wellness journey.
            </p>
          </div>
        </div>
      </section>

      {/* ================= CATEGORIES ================= */}
      <section className="py-20">
        <h2 className="text-4xl font-bold text-center mb-14">
          Explore Categories
        </h2>

        <div className="flex flex-wrap justify-center gap-12">
          {categories.map((cat) => (
            <div
              key={cat._id}
              onClick={() => navigate(`/category/${cat._id}`)}
              className="group cursor-pointer text-center"
            >
              <div className="w-40 h-40 mx-auto rounded-full overflow-hidden shadow-md group-hover:shadow-xl transition">
                <img
                  src={
                    cat.image?.startsWith("http")
                      ? cat.image
                      : `${API_URL}${cat.image}`
                  }
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="mt-5 font-medium text-green-800 group-hover:text-green-600 transition">
                {cat.name?.en}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= PRODUCTS ================= */}
      <section ref={popularRef} className="py-20 bg-white">
        <h2 className="text-4xl font-bold text-center mb-14">
          Top Essentials
        </h2>

        <div className="flex flex-wrap justify-center gap-10">
          {popularProducts.map((product) => (
            <div
              key={product._id}
              className="bg-[#f9fdfb] w-72 p-6 rounded-2xl shadow-sm hover:shadow-lg transition"
            >
              <div
                onClick={() => navigate(`/product/${product._id}`)}
                className="cursor-pointer"
              >
                <img
                  src={
                    product.image?.startsWith("http")
                      ? product.image
                      : `${API_URL}${product.image}`
                  }
                  className="w-44 h-44 mx-auto object-cover"
                />
                <h3 className="text-center font-semibold mt-4">
                  {product.name?.en}
                </h3>
              </div>

              <p className="text-center text-green-700 font-bold text-lg mt-2">
                ₹{product.price}
              </p>

              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() =>
                    isWishlisted(product._id)
                      ? removeFromWishlist(product._id)
                      : addToWishlist(product)
                  }
                  className="text-xl"
                >
                  {isWishlisted(product._id) ? "❤️" : "🤍"}
                </button>

                <button
                  onClick={() => addToCart(product)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= SOFT CTA ================= */}
      <section className="py-20 bg-green-100 text-center">
        <h2 className="text-3xl font-bold text-green-900 mb-6">
          Begin Your Wellness Journey Today
        </h2>
        <button
          onClick={() => navigate("/contact")}
          className="px-8 py-3 bg-green-700 hover:bg-green-800 text-white rounded-full shadow-md transition"
        >
          Contact Us
        </button>
      </section>
    </div>
  );
}