import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "https://restosdesgosses.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE,
});

// INTERCEPTOR pour ajouter automatiquement le token à chaque requête
api.interceptors.request.use((config) => {
  
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("Token ajouté :", token);

  }else{
    console.log("Aucun token trouvé");
  }
  return config;
});

console.log("API baseURL utilisée :", api.defaults.baseURL);


export const fetchRestaurants = () => api.get("/restaurants");

export default api;
