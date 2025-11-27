import { API_URL } from "../utils/api";

const fetchProducts = async () => {
  try {
    const res = await fetch(`${API_URL}/api/products`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`
      }
    });
    const data = await res.json();
    setProducts(data);
  } catch (err) {
    console.error(err);
  }
};
