import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../components/CartContext";
import { useWishlist } from "../components/WishlistContext";

const API_URL = "http://localhost:5000";

export default function CategoryPage() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/products/category/${id}`);
        setProducts(res.data);

        if (res.data.length > 0) {
          setCategoryName(res.data[0].category?.name?.ta || res.data[0].category?.name?.en);
        }
      } catch (err) {
        console.error("❌ Error fetching category products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [id]);

  if (loading) {
    return <div className="text-center text-lg font-semibold py-10">Loading...</div>;
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 text-gray-600 text-lg">
        No products found in this category 😢
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <h1 className="text-3xl font-bold text-center mb-8">
        🛍️ {categoryName || "Category Products"}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-2xl shadow-lg p-5 hover:scale-105 transform transition duration-300"
          >
            <img
              src={product.image}
              alt={product.name?.en}
              className="w-full h-56 object-cover rounded-xl cursor-pointer"
              onClick={() => navigate(`/product/${product._id}`)}
            />
            <h2 className="text-xl font-semibold mt-4">
              {product.name?.ta || product.name?.en}
            </h2>
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">{product.description}</p>
            <p className="text-blue-600 font-bold mt-2">₹{product.price}</p>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => addToCart(product)}
                className="flex-1 bg-blue-500 text-white rounded-lg py-2 hover:bg-blue-600 transition"
              >
                Add to Cart
              </button>
              <button
                onClick={() => addToWishlist(product)}
                className="flex-1 bg-pink-500 text-white rounded-lg py-2 hover:bg-pink-600 transition"
              >
                ❤️ Wishlist
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
