import axios from "axios";

const API_BASE_URL = "https://localhost:7264/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    // 403 Forbidden
    if (error.response?.status === 403) {
      console.error("Access denied");
    }

    return Promise.reject(error);
  },
);

export default api;
