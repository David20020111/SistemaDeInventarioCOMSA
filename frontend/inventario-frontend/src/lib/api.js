import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000", // URL de tu backend
});

// Interceptor para añadir el token en cada petición
API.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;