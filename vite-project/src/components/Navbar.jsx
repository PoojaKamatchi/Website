import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../components/CartContext";
import { useWishlist } from "../components/WishlistContext";
import axios from "axios";
import logoImage from "../assets/logo Ecom.jpg";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount = 0, fetchCart } = useCart();
  const { wishlist = [], fetchWishlist } = useWishlist();

  const [profileOpen, setProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [user, setUser] = useState(null);

  const wishlistRef = useRef(null);
  const cartRef = useRef(null);
  const closeTimer = useRef(null);

  const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

  // Animate badge when count changes
  useEffect(() => {
    if (wishlistRef.current) {
      wishlistRef.current.classList.add("bump");
      const timer = setTimeout(() => wishlistRef.current.classList.remove("bump"), 300);
      return () => clearTimeout(timer);
    }
  }, [wishlist.length]);

  useEffect(() => {
    if (cartRef.current) {
      cartRef.current.classList.add("bump");
      const timer = setTimeout(() => cartRef.current.classList.remove("bump"), 300);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  useEffect(() => {
    fetchCart?.();
    fetchWishlist?.();

    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);

    const token = localStorage.getItem("authToken");
    const name = localStorage.getItem("userName");

    if (token && name) setUser({ name, token });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    setUser(null);
    navigate("/login");
  };

  const openDropdown = () => {
    clearTimeout(closeTimer.current);
    setProfileOpen(true);
  };

  const closeDropdown = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => {
      setProfileOpen(false);
    }, 3000);
  };

  // Fetch suggestions while typing
  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/products/search?query=${query}`);
        setSuggestions(res.data || []);
      } catch (err) {
        console.error(err);
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [query]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "backdrop-blur-md bg-gradient-to-r from-black via-green-700 to-green-500 shadow-lg"
          : "bg-gradient-to-r from-black via-green-600 to-green-400"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* LOGO */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <img src={logoImage} alt="Logo" className="w-12 h-12 rounded-full animate-spin-slow object-cover" />
              {location.pathname !== "/" && (
                <span className="text-white font-bold text-xl">Home</span>
              )}
            </Link>
          </div>

          {/* SEARCH */}
          <div className="flex flex-1 justify-center relative">
            <form
              className="relative w-full flex justify-end md:justify-center"
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
                className="rounded-full border border-gray-500 text-black placeholder-black bg-white/80
                  transition-all duration-300 outline-none
                  w-28 px-2 py-1 text-xs
                  md:w-72 md:px-4 md:py-2 md:text-base"
              />

              {/* SUGGESTIONS */}
              {suggestions.length > 0 && (
                <ul className="absolute top-full mt-1 w-full bg-white shadow-lg rounded-md z-50 max-h-64 overflow-auto">
                  {suggestions.map((item) => (
                    <li
                      key={item._id}
                      className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => {
                        navigate(`/product/${item._id}`);
                        setQuery("");
                        setSuggestions([]);
                      }}
                    >
                      {item.name.en} {item.name.ta && `(${item.name.ta})`}
                    </li>
                  ))}
                </ul>
              )}
            </form>
          </div>

          {/* RIGHT ICONS */}
          <div className="flex items-center gap-3">
            {/* Wishlist */}
            <button onClick={() => navigate("/wishlist")} className="relative p-2 rounded-full hover:bg-white/10 text-white">
              ❤️
              {wishlist.length > 0 && <span ref={wishlistRef} className="absolute -top-1 -right-1 px-2 py-1 text-xs font-bold text-white bg-pink-600 rounded-full transition-transform duration-300">{wishlist.length}</span>}
            </button>

            {/* Cart */}
            <button onClick={() => navigate("/cart")} className="relative p-2 rounded-full hover:bg-white/10 text-white">
              🛒
              {cartCount > 0 && <span ref={cartRef} className="absolute -top-1 -right-1 px-2 py-1 text-xs font-bold text-white bg-red-600 rounded-full transition-transform duration-300">{cartCount}</span>}
            </button>

            {/* Profile */}
            <div className="relative" onMouseEnter={openDropdown} onMouseLeave={closeDropdown}>
              {!user ? (
                <button onClick={() => navigate("/login")} className="px-3 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700">Login</button>
              ) : (
                <>
                  <button className="p-2 rounded-full hover:bg-white/10 text-white">{user.name[0].toUpperCase()}</button>
                  <div className={`absolute right-0 mt-2 w-44 bg-white text-black rounded-lg shadow-lg py-2 z-50 transition-all duration-300 ${profileOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3 pointer-events-none"}`}>
                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                    <Link to="/orders" className="block px-4 py-2 hover:bg-gray-100">Orders</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button>
                  </div>
                </>
              )}
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .bump { transform: scale(1.3); }
        .animate-spin-slow { animation: spin 20s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </nav>
  );
}
