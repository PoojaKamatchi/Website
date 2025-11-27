import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../components/CartContext";
import { useWishlist } from "../components/WishlistContext";
import axios from "axios";
import homeVideo from "../assets/home.mp4";

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
    
{/* HERO SECTION */}
<section className="relative w-full h-[350px] sm:h-[450px] lg:h-[70vh] flex items-center overflow-hidden px-4 mt-16">
  {/* Video Background */}
  <video
    src={homeVideo} // imported from assets
    autoPlay
    loop
    muted
    playsInline
    className="absolute left-0 top-0 w-full h-full object-cover brightness-[0.45] z-0 rounded-xl"
  />

  {/* Gradient overlay for readability */}
  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/70 z-5 rounded-xl"></div>

  {/* Text Content */}
  <div className="relative z-10 max-w-lg sm:max-w-xl lg:max-w-2xl flex flex-col justify-center animate-slideInLeft"
       style={{ width: "70%" }}>
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

  {/* Animations */}
  <style>{`
    @keyframes gradientText {
      0% {background-position:0% 50%;}
      50% {background-position:100% 50%;}
      100% {background-position:0% 50%;}
    }
    .animate-gradientText {
      background-size: 200% 200%;
      animation: gradientText 3s ease infinite;
    }

    @keyframes slideInLeft {
      0% { opacity: 0; transform: translateX(-50px); }
      100% { opacity: 1; transform: translateX(0); }
    }
    .animate-slideInLeft {
      animation: slideInLeft 1s ease-out forwards;
    }
  `}</style>
</section>

      {/* CATEGORIES */}
     {/* CATEGORIES */}
<section className="py-16 bg-green-100 relative">
  <div className="max-w-7xl mx-auto px-4">
    <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
      Shop by Category
    </h2>

    {loadingCategories ? (
      <p className="text-center text-gray-600">Loading categories...</p>
    ) : categories.length === 0 ? (
      <p className="text-center text-gray-600">No categories available.</p>
    ) : (
      <div className="relative">
        {/* Scroll container */}
        <div className="flex space-x-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory py-4">
          {categories.map((cat) => {
            const nameEn = cat.name?.en || "Unnamed";
            const imageUrl = cat.image?.startsWith("http")
              ? cat.image
              : `${API_URL}${cat.image}`;
            const gradientClass = cat.type === "grocery"
              ? "from-green-300 to-green-500"
              : cat.type === "medicine"
              ? "from-blue-400 to-purple-500"
              : "from-pink-300 to-yellow-400";

            return (
              <div
                key={cat._id}
                onClick={() => navigate(`/category/${cat._id}`)}
                className={`flex-none w-36 h-36 sm:w-44 sm:h-44 rounded-full shadow-lg cursor-pointer bg-gradient-to-br ${gradientClass} text-white transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-1 snap-center relative overflow-hidden group`}
              >
                <img
                  src={imageUrl || "https://via.placeholder.com/150"}
                  alt={nameEn}
                  className="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover:scale-110"
                />
                {/* Overlay for text readability */}
                <div className="absolute inset-0 bg-black/20 rounded-full"></div>
                <h3 className="absolute bottom-3 left-1/2 -translate-x-1/2 text-center font-semibold text-sm sm:text-base z-10 transition-all duration-500 group-hover:text-yellow-300 group-hover:scale-105 drop-shadow-lg">
                  {nameEn}
                </h3>
              </div>
            );
          })}
        </div>

        {/* Gradient overlays */}
        <div className="absolute top-0 left-0 h-full w-12 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none z-20"></div>
        <div className="absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none z-20"></div>
      </div>
    )}
  </div>

  <style>{`
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
  `}</style>
</section>



      {/* POPULAR PRODUCTS */}
      <section ref={popularRef} className="py-16 bg-blue-100 relative">
        <div className="max-w-7xl mx-auto px-4 relative">
          <h2 className="text-3xl font-bold text-center mb-6">Top Essentials</h2>
          {loadingProducts ? (
            <p className="text-center text-gray-600">Loading items...</p>
          ) : popularProducts.length === 0 ? (
            <p className="text-center text-gray-600">No items found.</p>
          ) : (
            <div className="relative">
              <div
                id="scrollContainer"
                className="flex space-x-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory py-4 relative z-10"
              >
                {popularProducts.map((product, index) => (
                  <div
                    key={product._id}
                    data-index={index}
                    className="flex-none w-44 sm:w-52 bg-white rounded-xl shadow-md p-3 transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:scale-105 snap-center"
                  >
                    <img
                      src={product.image || "https://via.placeholder.com/150"}
                      alt={product.name?.en}
                      className="w-full h-32 object-cover rounded mb-2"
                    />
                    <h3 className="text-sm font-semibold">{product.name?.en}</h3>
                    <p className="text-gray-600 text-sm mt-1">₹{product.price}</p>

                    <button
                      onClick={() =>
                        isWishlisted(product._id)
                          ? removeFromWishlist(product._id)
                          : addToWishlist(product)
                      }
                      className="mt-2 w-full border border-pink-500 text-pink-500 py-1 rounded-lg hover:bg-pink-500 hover:text-white text-xs transition-colors"
                    >
                      {isWishlisted(product._id) ? "❤️ Wishlisted" : "🤍 Wishlist"}
                    </button>

                    <button
                      onClick={() => addToCart(product)}
                      className="mt-2 w-full bg-purple-700 hover:bg-purple-600 text-white py-1 rounded-lg text-xs transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>

              {/* Gradient overlays */}
              <div className="absolute top-0 left-0 h-full w-12 bg-gradient-to-r from-gray-100/90 to-transparent pointer-events-none z-20"></div>
              <div className="absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-gray-100/90 to-transparent pointer-events-none z-20"></div>

              {/* Left Arrow */}
              <button
                onClick={() => {
                  const container = document.getElementById("scrollContainer");
                  container.scrollBy({ left: -200, behavior: "smooth" });
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow z-30"
              >
                &lt;
              </button>

              {/* Right Arrow */}
              <button
                onClick={() => {
                  const container = document.getElementById("scrollContainer");
                  container.scrollBy({ left: 200, behavior: "smooth" });
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow z-30"
              >
                &gt;
              </button>
            </div>
          )}
        </div>

        <style>{`
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
      </section>

      {/* Animations */}
      <style>{`
        @keyframes fadeUp {0% {opacity: 0; transform: translateY(20px);}100% {opacity: 1; transform: translateY(0);}}
        .animate-fadeUp { animation: fadeUp 1s ease-out forwards; }

        @keyframes textFade {0%{opacity:0.7;}50%{opacity:1;}100%{opacity:0.7;}}
        .animate-textFade { animation: textFade 2.5s ease-in-out infinite; }

        @keyframes textGlow {0%{text-shadow:0 0 10px #ff7ee7;}50%{text-shadow:0 0 30px #ffa6ff;}100%{text-shadow:0 0 10px #ff7ee7;}}
        .animate-textGlow { animation: textGlow 3s infinite alternate; }

        .highlight { background-color: #fff9c4; transition: background-color 1s ease; }
      `}</style>
    </div>
  );
}
