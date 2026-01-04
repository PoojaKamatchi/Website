import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../components/CartContext";
import { useWishlist } from "../components/WishlistContext";
import axios from "axios";
import logoImage from "../assets/logo Ecom.jpg";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const { cartCount = 0, fetchCart } = useCart();
  const { wishlist = [], fetchWishlist } = useWishlist();

  const [profileOpen, setProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const wishlistRef = useRef(null);
  const cartRef = useRef(null);
  const closeTimer = useRef(null);

  const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

  /* 🔐 AUTH (DERIVED – NO STATE BUGS) */
  const token = localStorage.getItem("authToken");
  const userName = localStorage.getItem("userName");
  const user = token && userName ? { name: userName } : null;

  /* INITIAL LOAD */
  useEffect(() => {
    fetchCart?.();
    fetchWishlist?.();

    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Wishlist animation */
  useEffect(() => {
    if (wishlistRef.current) {
      wishlistRef.current.classList.add("bump");
      setTimeout(() => wishlistRef.current?.classList.remove("bump"), 300);
    }
  }, [wishlist.length]);

  /* Cart animation */
  useEffect(() => {
    if (cartRef.current) {
      cartRef.current.classList.add("bump");
      setTimeout(() => cartRef.current?.classList.remove("bump"), 300);
    }
  }, [cartCount]);

  /* SEARCH SUGGESTIONS */
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/products/search?query=${encodeURIComponent(query)}`
        );
        setSuggestions(res.data || []);
      } catch {
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [query]);

  /* LOGOUT */
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  /* PROFILE DROPDOWN */
  const openDropdown = () => {
    clearTimeout(closeTimer.current);
    setProfileOpen(true);
  };

  const closeDropdown = () => {
    closeTimer.current = setTimeout(() => setProfileOpen(false), 250);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* NAVBAR */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 pointer-events-auto transition-all duration-300 ${
          isScrolled
            ? "backdrop-blur-md bg-gradient-to-r from-black via-green-700 to-green-500 shadow-lg"
            : "bg-gradient-to-r from-black via-green-600 to-green-400"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">

            {/* LOGO */}
            <Link to="/" className="flex items-center gap-2">
              <img
                src={logoImage}
                alt="Logo"
                className="w-10 h-10 rounded-full animate-spin-slow object-cover"
              />
              {location.pathname !== "/" && (
                <span className="text-white font-bold text-sm">Home</span>
              )}
            </Link>

            {/* SEARCH */}
            <div className="relative flex-1 mx-4 hidden md:flex justify-center z-50">
              <form
                className="relative w-full max-w-md"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!query.trim()) return;
                  navigate(`/search?query=${encodeURIComponent(query.trim())}`);
                  setQuery("");
                  setSuggestions([]);
                }}
              >
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-4 py-2 rounded-full text-black bg-white outline-none focus:ring-2 focus:ring-green-500"
                />

                {suggestions.length > 0 && (
                  <ul className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                    {suggestions.map((item) => (
                      <li
                        key={item._id}
                        onClick={() => {
                          navigate(`/product/${item._id}`);
                          setQuery("");
                          setSuggestions([]);
                        }}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {item.name.en}
                      </li>
                    ))}
                  </ul>
                )}
              </form>
            </div>

            {/* RIGHT ICONS */}
            <div className="flex items-center gap-3">
              {/* Wishlist */}
              <button onClick={() => navigate("/wishlist")} className="relative text-white">
                ❤️
                {wishlist.length > 0 && (
                  <span
                    ref={wishlistRef}
                    className="absolute -top-2 -right-2 text-xs bg-pink-600 rounded-full px-1"
                  >
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Cart */}
              <button onClick={() => navigate("/cart")} className="relative text-white">
                🛒
                {cartCount > 0 && (
                  <span
                    ref={cartRef}
                    className="absolute -top-2 -right-2 text-xs bg-red-600 rounded-full px-1"
                  >
                    {cartCount}
                  </span>
                )}
              </button>

              {/* PROFILE */}
              <div
                className="relative"
                onMouseEnter={openDropdown}
                onMouseLeave={closeDropdown}
              >
                {!user ? (
                  <button
                    onClick={() => navigate("/login")}
                    className="px-4 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Login
                  </button>
                ) : (
                  <>
                    <button className="w-9 h-9 rounded-full bg-white text-green-700 font-bold">
                      {user.name[0].toUpperCase()}
                    </button>

                    <div
                      className={`absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg transition-all ${
                        profileOpen
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 -translate-y-2 pointer-events-none"
                      }`}
                    >
                      <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">
                        Profile
                      </Link>
                      <Link to="/orders" className="block px-4 py-2 hover:bg-gray-100">
                        Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* STYLES */}
        <style>{`
          .bump { transform: scale(1.3); }
          .animate-spin-slow { animation: spin 18s linear infinite; }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </nav>

      {/* PAGE CONTENT */}
      <main className="pt-16 flex-1">{children}</main>
    </div>
  );
}
