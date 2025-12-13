import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../components/CartContext";
import { useWishlist } from "../components/WishlistContext";
import axios from "axios";
import homeVideo from "../assets/home.mp4";
import OffersSection from "../components/OffersSection"; // ⭐ ADD THIS

export default function Home() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const popularRef = useRef(null);

  const [visibleProducts, setVisibleProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const isWishlisted = (id) => wishlist.some((item) => item._id === id);

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/categories`);
        setCategories(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Products
  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/products`);
        setPopularProducts(res.data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setPopularProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchPopularProducts();
  }, []);

  // Scroll to Popular Section
  const handleScrollToPopular = () => {
    if (popularRef.current) {
      popularRef.current.scrollIntoView({ behavior: "smooth" });
      popularRef.current.classList.add("highlight");
      setTimeout(() => popularRef.current.classList.remove("highlight"), 1000);
    }
  };

  // Reveal Animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleProducts((prev) => [...prev, entry.target.dataset.index]);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".product-card").forEach((el) => observer.observe(el));
  }, [popularProducts]);

  return (
    <div className="bg-gray-50 text-gray-900">

      {/* HERO SECTION */}
      <section className="relative w-full h-[350px] sm:h-[450px] lg:h-[70vh] flex items-center overflow-hidden px-4 mt-16">
        <video
          src={homeVideo}
          autoPlay
          loop
          muted
          playsInline
          className="absolute left-0 top-0 w-full h-full object-cover brightness-[0.45] z-0 rounded-xl"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/70 z-5 rounded-xl"></div>

        <div
          className="relative z-10 max-w-lg sm:max-w-xl lg:max-w-2xl flex flex-col justify-center animate-slideInLeft"
          style={{ width: "70%" }}
        >
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-4 text-white drop-shadow-lg">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Life Gain
            </span>
          </h1>
          <p className="text-white/90 text-base sm:text-lg mb-6 font-medium">
            Shop smart, live stylishly!
          </p>
          <button
            onClick={handleScrollToPopular}
            className="px-5 py-3 sm:px-6 sm:py-3 font-semibold rounded-full bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg hover:scale-105 transition-transform duration-300"
          >
            Shop Now
          </button>
        </div>

        <style>{`
          @keyframes slideInLeft {
            0% { opacity: 0; transform: translateX(-50px); }
            100% { opacity: 1; transform: translateX(0); }
          }
          .animate-slideInLeft {
            animation: slideInLeft 1s ease-out forwards;
          }
        `}</style>
      </section>

      {/* ⭐⭐ OFFER SECTION (NEW) ⭐⭐ */}
      <OffersSection />

      {/* CATEGORIES */}
   <section className="py-16 bg-gradient-to-r from-green-100 to-blue-100 relative">
  <div className="max-w-7xl mx-auto px-6">
    
    {/* Section Heading */}
    <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-12 
                   bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600
                   animate-gradient-x">
      Shop by Category
    </h2>

    {/* Categories Grid */}
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
      {categories?.map((cat) => (
        <div
          key={cat._id}
          onClick={() => navigate(`/category/${cat._id}`)}
          className="relative p-6 rounded-2xl cursor-pointer group transform transition 
                     duration-500 hover:scale-105 bg-white border-2 border-gray-200
                     shadow-lg hover:border-green-400 hover:bg-gradient-to-br from-white to-green-50 
                     overflow-hidden animate-float"
        >
          {/* Floating Gradient Glow */}
          <div className="absolute inset-0 rounded-2xl opacity-30 blur-3xl 
                          bg-gradient-to-br from-green-300 via-green-200 to-green-400
                          animate-pulse-slow"></div>

          {/* Category Image (Bigger) */}
          <img
            src={
              cat.image?.startsWith("http")
                ? cat.image
                : `${API_URL}${cat.image}`
            }
            className="w-32 h-32 mx-auto rounded-full object-cover shadow-md
                       group-hover:scale-110 transition-all duration-300"
          />

          {/* Category Name */}
          <h3 className="mt-4 text-center font-semibold text-gray-800 
                         group-hover:text-green-700 transition-colors duration-300">
            {cat.name?.en || cat.name}
          </h3>

          {/* Arrow Animation */}
          <div className="flex justify-center mt-2 opacity-0 group-hover:opacity-100 transition-all duration-500">
            <span className="text-green-600 text-sm animate-pulse">→</span>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>


      {/* POPULAR PRODUCTS */}
     {/* POPULAR PRODUCTS */}
<section ref={popularRef} className="py-16 bg-blue-100 relative">
  <div className="max-w-7xl mx-auto px-4">
    <h2 className="text-3xl font-bold text-center mb-10">
      Top Essentials
    </h2>

    {loadingProducts ? (
      <p className="text-center text-gray-600">Loading items...</p>
    ) : popularProducts.length === 0 ? (
      <p className="text-center text-gray-600">No items found.</p>
    ) : (
      <div className="flex flex-wrap justify-center gap-8">

        {popularProducts.map((product) => (
          <div
            key={product._id}
            className="relative border rounded-lg shadow-lg p-4 bg-white w-64 hover:shadow-2xl transition transform hover:scale-105 cursor-pointer"
            onClick={() => navigate(`/product/${product._id}`)}
          >

            {/* Wishlist Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                isWishlisted(product._id)
                  ? removeFromWishlist(product._id)
                  : addToWishlist(product);
              }}
              className="absolute top-3 right-3"
            >
              <svg
                className={`w-6 h-6 ${
                  isWishlisted(product._id)
                    ? "text-pink-500 fill-pink-500"
                    : "text-gray-400"
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>

            {/* Product Image */}
            <img
              src={
                product.image?.startsWith("http")
                  ? product.image
                  : `${API_URL}${product.image}`
              }
              alt={product.name?.en || product.name}
              className="w-40 h-40 object-cover mb-4 mx-auto rounded"
            />

            {/* Product Name */}
            <h2 className="text-lg font-semibold text-center">
              {product.name?.en || product.name}
            </h2>

            {/* Price */}
            <p className="text-blue-600 font-bold text-center mt-1">
              ₹{product.price}
            </p>

            {/* Stock */}
            <p
              className={`text-sm text-center ${
                product.stock === 0 ? "text-red-500" : "text-gray-700"
              }`}
            >
              {product.stock > 0 ? `Stock: ${product.stock}` : "Out of stock"}
            </p>

            {/* Add to Cart */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
              disabled={product.stock === 0}
              className={`mt-3 w-full px-3 py-2 rounded text-white ${
                product.stock > 0
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
</section>


      {/* FLOATING CONTACT BUTTON */}
      <button
        onClick={() => navigate("/contact")}
        className="fixed bottom-5 right-5 z-50 bg-gradient-to-r from-blue-500 to-green-500 
        text-white px-5 py-3 rounded-full shadow-xl hover:scale-110 transition-transform duration-300 animate-bounce"
      >
        📞 Contact
      </button>
    </div>
  );
}
