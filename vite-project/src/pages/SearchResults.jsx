import React, { useEffect, useState } from "react";
import axios from "axios";
import Product from "../components/Product";
import { useLocation } from "react-router-dom";

export default function SearchResults() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");
  const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/api/products/search?query=${encodeURIComponent(query)}`);
        setProducts(res.data || []);
      } catch (error) {
        console.error(error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  return (
    <div className="search-results p-4">
      {loading && <p>Loading...</p>}
      {!loading && products.length === 0 && <p>No products found.</p>}
      {!loading && products.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((item) => <Product key={item._id} item={item} />)}
        </div>
      )}
    </div>
  );
}
