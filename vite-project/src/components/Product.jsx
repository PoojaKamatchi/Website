import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../components/CartContext.jsx";
import { useWishlist } from "../components/WishlistContext.jsx";

export default function CustomerCategoryPage() {
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalProduct, setModalProduct] = useState(null); // Modal state

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Fetch products and categories
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/products`);
        const data = Array.isArray(res.data.products) ? res.data.products : [];

        const uniqueCategories = [...new Set(data.map(p => p.category || "Uncategorized"))];
        setCategories(["All", ...uniqueCategories]);
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err.response?.data || err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Toggle wishlist
  const toggleWishlist = (product) => {
    if (isInWishlist(product._id)) removeFromWishlist(product._id);
    else addToWishlist(product);
  };

  // Filter products by category + search
  const filteredProducts = products
    .filter(p => selectedCategory === "All" || p.category === selectedCategory)
    .filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Pagination logic
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  if (loading) return <p className="text-center mt-10 text-gray-600">Loading products...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-cyan-100 to-blue-100 py-10 px-4">
      <h2 className="text-center text-3xl font-bold text-blue-700 mb-6">
        Explore Our Collections
      </h2>

      {/* Search Bar */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border rounded w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center mb-8 gap-4">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setCurrentPage(1);
            }}
            className={`px-5 py-2 rounded-full font-semibold transition-all ${
              selectedCategory === cat
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-blue-700 border border-blue-400 hover:bg-blue-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Display */}
      {currentProducts.length === 0 ? (
        <p className="text-center text-gray-600">No products found.</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-8">
          {currentProducts.map(product => {
            const inWishlist = isInWishlist(product._id);

            return (
              <div
                key={product._id}
                className="relative border rounded-lg shadow-lg p-4 bg-white w-64 hover:shadow-2xl transition transform hover:scale-105"
              >
                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-3 right-3"
                  title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  <svg
                    className={`w-6 h-6 ${inWishlist ? "text-pink-500 fill-pink-500" : "text-gray-400"}`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </button>

                {/* Image */}
                <img
                  src={product.image || "https://via.placeholder.com/150"}
                  alt={product.name}
                  className="w-40 h-40 object-cover mb-4 mx-auto rounded"
                />

                {/* Product Info */}
                <h2 className="text-lg font-semibold text-center">{product.name}</h2>
                <p className="text-gray-500 text-sm text-center mb-1">
                  Category: {product.category || "Uncategorized"}
                </p>
                <p className="text-gray-700 text-sm text-center mb-1">{product.description}</p>
                <p className="text-blue-600 font-bold text-center">₹{product.price}</p>
                <p className={`text-sm text-center ${product.stock === 0 ? "text-red-500" : "text-gray-700"}`}>
                  Stock: {product.stock > 0 ? product.stock : "Out of stock"}
                </p>

                {/* Add to Cart + View More */}
                <div className="flex justify-center mt-3 gap-2">
                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className={`px-3 py-1 rounded text-white ${
                      product.stock > 0 ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => setModalProduct(product)}
                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
                  >
                    View More
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-3">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`px-3 py-1 rounded ${
                currentPage === num ? "bg-blue-600 text-white" : "bg-white border border-blue-400 text-blue-700 hover:bg-blue-100"
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full relative shadow-2xl">
            <button
              onClick={() => setModalProduct(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 font-bold"
            >
              ✖
            </button>
            <img
              src={modalProduct.image || "https://via.placeholder.com/150"}
              alt={modalProduct.name}
              className="w-full h-64 object-cover mb-4 rounded"
            />
            <h2 className="text-xl font-bold mb-2">{modalProduct.name}</h2>
            <p className="text-gray-600 mb-2">Category: {modalProduct.category || "Uncategorized"}</p>
            <p className="text-gray-700 mb-2">{modalProduct.description}</p>
            <p className="text-blue-600 font-bold mb-2">₹{modalProduct.price}</p>
            <p className={`mb-4 ${modalProduct.stock === 0 ? "text-red-500" : "text-gray-700"}`}>
              Stock: {modalProduct.stock > 0 ? modalProduct.stock : "Out of stock"}
            </p>
            <button
              onClick={() => {
                addToCart(modalProduct);
                setModalProduct(null);
              }}
              disabled={modalProduct.stock === 0}
              className={`w-full px-3 py-2 rounded text-white ${
                modalProduct.stock > 0 ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
