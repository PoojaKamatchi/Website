// src/pages/SearchResults.jsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useCart } from "../components/CartContext";
import Product from "../components/Product";

export default function SearchResults() {
  const location = useLocation();
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const query = new URLSearchParams(location.search).get("query") || "";
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(false);

      if (!query.trim()) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API_URL}/api/products/search?query=${encodeURIComponent(query.trim())}`);
        setProducts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(true);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query, API_URL]);

  if (loading) {
    return (
      <div className="p-4 max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {[...Array(8)].map((_, idx) => (
          <div key={idx} className="bg-gray-200 animate-pulse h-64 rounded-md" />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-center p-4 text-red-600">Failed to fetch products. Backend might not be connected.</p>;
  }

  if (!query.trim()) {
    return <p className="text-center p-4 text-gray-600">Please enter a search query.</p>;
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Search results for "{query}"
      </h2>

      {products.length === 0 ? (
        <p className="text-center text-gray-600">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Product key={product._id} product={product} addToCart={addToCart} />
          ))}
        </div>
      )}
    </div>
  );
}
