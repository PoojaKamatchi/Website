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

  // ✅ USE EXISTING WISHLIST FUNCTIONS
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const popularRef = useRef(null);
  const categoryRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    axios
      .get(`${API_URL}/api/categories`)
      .then((res) => setCategories(res.data || []))
      .catch(() => setCategories([]));

    axios
      .get(`${API_URL}/api/products`)
      .then((res) => setPopularProducts(res.data || []))
      .catch(() => setPopularProducts([]));
  }, []);

  // ✅ CHECK WISHLIST STATUS
  const isWishlisted = (id) => wishlist.some((item) => item._id === id);

  return (
    <div className="bg-gray-50">

      {/* HERO */}
      <section className="relative h-[60vh] flex items-center overflow-hidden">
        <video
          src={homeVideo}
          autoPlay
          loop
          muted
          className="absolute inset-0 w-full h-full object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 text-center w-full">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to <span className="text-green-400">Life Gain</span>
          </h1>
          <button
            onClick={() =>
              popularRef.current?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-6 py-3 bg-green-500 text-white rounded-full hover:scale-105 transition"
          >
            Shop Now
          </button>
        </div>
      </section>

      <OffersSection />

      {/* CATEGORIES */}
      <section ref={categoryRef} className="py-16 bg-green-100">
        <h2 className="text-3xl font-bold text-center mb-10">
          Shop by Category
        </h2>

        <div className="flex flex-wrap justify-center gap-6">
          {categories.map((cat) => (
            <div
              key={cat._id}
              onClick={() => navigate(`/category/${cat._id}`)}
              className="bg-white p-6 rounded-xl shadow cursor-pointer hover:scale-105 transition"
            >
              <img
                src={
                  cat.image?.startsWith("http")
                    ? cat.image
                    : `${API_URL}${cat.image}`
                }
                className="w-32 h-32 mx-auto rounded-full object-cover"
              />
              <p className="text-center mt-3 font-semibold">
                {cat.name?.en}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* POPULAR PRODUCTS */}
      <section ref={popularRef} className="py-16 bg-blue-100">
        <h2 className="text-3xl font-bold text-center mb-10">
          Top Essentials
        </h2>

        <div className="flex flex-wrap justify-center gap-8">
          {popularProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white w-64 p-4 rounded-xl shadow hover:scale-105 transition"
            >
              {/* IMAGE */}
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
                  className="w-40 h-40 mx-auto object-cover"
                />
                <h3 className="text-center font-semibold mt-2">
                  {product.name?.en}
                </h3>
              </div>

              {/* PRICE */}
              <p className="text-center text-blue-600 font-bold mt-1">
                ₹{product.price}
              </p>

              {/* STOCK */}
              <p
                className={`text-center text-sm mt-1 ${
                  product.stock > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {product.stock > 0
                  ? `In Stock (${product.stock})`
                  : "Out of Stock"}
              </p>

              {/* ACTIONS */}
              <div className="flex justify-between items-center mt-3">
                {/* ❤️ WISHLIST */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    isWishlisted(product._id)
                      ? removeFromWishlist(product._id)
                      : addToWishlist(product);
                  }}
                  className="text-xl"
                >
                  {isWishlisted(product._id) ? "❤️" : "🤍"}
                </button>

                {/* 🛒 ADD TO CART */}
                <button
                  disabled={product.stock <= 0}
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
                  }}
                  className={`px-3 py-1 rounded text-white ${
                    product.stock > 0
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FLOATING CONTACT */}
      <button
        onClick={() => navigate("/contact")}
        className="fixed bottom-5 right-5 bg-green-500 text-white px-5 py-3 rounded-full shadow-lg hover:scale-110 transition"
      >
        📞 Contact
      </button>
    </div>
  );
}
