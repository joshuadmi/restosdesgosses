import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "https://restosdesgosses.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE,
});

export const fetchRestaurants = () => api.get("/restaurants");

export default api;
