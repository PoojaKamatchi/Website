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
  const { wishlist } = useWishlist();

  const popularRef = useRef(null);
  const categoryRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  /* ================= SCROLL HANDLERS ================= */
  const scrollToPopular = () => popularRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToCategory = () => categoryRef.current?.scrollIntoView({ behavior: "smooth" });

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    // Fetch categories
    axios.get(`${API_URL}/api/categories`)
      .then(res => setCategories(res.data || []))
      .catch(() => setCategories([]));

    // Fetch products
    axios.get(`${API_URL}/api/products`)
      .then(res => setPopularProducts(res.data || []))
      .catch(() => setPopularProducts([]));
  }, []);

  const isWishlisted = (id) => wishlist.some((item) => item._id === id);

  return (
    <div className="bg-gray-50 text-gray-900">

      {/* ================= HERO SECTION ================= */}
      <section className="relative w-full h-[350px] sm:h-[450px] lg:h-[70vh] flex items-center overflow-hidden">
        <video
          src={homeVideo}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-black/40" />

        <div className="relative z-10 max-w-2xl mx-auto text-center px-4">
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-4 text-white">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Life Gain
            </span>
          </h1>
          <p className="text-white/90 mb-6 text-lg">
            Shop smart, live stylishly!
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={scrollToPopular}
              className="px-6 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-green-500 to-blue-500 hover:scale-105 transition"
            >
              Shop Now
            </button>
            <button
              onClick={scrollToCategory}
              className="px-6 py-3 rounded-full font-semibold bg-white text-gray-900 hover:bg-gray-200 transition"
            >
              Categories
            </button>
          </div>
        </div>
      </section>

      {/* ================= OFFERS ================= */}
      <OffersSection />

      {/* ================= CATEGORIES ================= */}
      <section ref={categoryRef} className="py-16 bg-gradient-to-r from-green-100 to-blue-100">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-center mb-12 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
            {categories.map((cat) => (
              <div
                key={cat._id}
                onClick={() => navigate(`/category/${cat._id}`)}
                className="p-6 bg-white rounded-2xl shadow-lg cursor-pointer hover:scale-105 transition"
              >
                <img
                  src={cat.image?.startsWith("http") ? cat.image : `${API_URL}${cat.image}`}
                  alt={cat.name?.en || cat.name}
                  className="w-32 h-32 mx-auto rounded-full object-cover"
                  loading="lazy"
                />
                <h3 className="mt-4 text-center font-semibold">{cat.name?.en || cat.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= POPULAR PRODUCTS ================= */}
      <section ref={popularRef} className="py-16 bg-blue-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Top Essentials</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {popularProducts.map((product) => (
              <div
                key={product._id}
                onClick={() => navigate(`/product/${product._id}`)}
                className="bg-white p-4 w-64 rounded-lg shadow-lg hover:scale-105 transition cursor-pointer"
              >
                <img
                  src={product.image?.startsWith("http") ? product.image : `${API_URL}${product.image}`}
                  alt={product.name?.en || product.name}
                  className="w-40 h-40 mx-auto object-cover"
                  loading="lazy"
                />
                <h3 className="text-center font-semibold mt-2">{product.name?.en || product.name}</h3>
                <p className="text-center text-blue-600 font-bold">₹{product.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FLOATING CONTACT ================= */}
      <button
        onClick={() => navigate("/contact")}
        className="fixed bottom-5 right-5 z-50 bg-gradient-to-r from-blue-500 to-green-500 text-white px-5 py-3 rounded-full shadow-xl hover:scale-110 transition animate-bounce"
      >
        📞 Contact
      </button>
    </div>
  );
}
