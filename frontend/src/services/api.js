import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.PROD ? "/api" : (import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api"),
  withCredentials: true,
});

axios.get("/api/auth/me", {
  withCredentials: true,
});

export default api;

