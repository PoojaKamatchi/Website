import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach user token automatically
API.interceptors.request.use((req) => {
  const userToken = localStorage.getItem("userToken");
  if (userToken) {
    req.headers.Authorization = `Bearer ${userToken}`;
  }
  return req;
});

export default API;
