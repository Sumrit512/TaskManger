import axios from "axios";

const api = axios.create({
  baseURL: "https://taskmanagerbackend-1-qlp4.onrender.com", // backend later
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
