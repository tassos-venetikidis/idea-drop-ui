import axios from "axios";
import { getStoredAccessToken } from "./authToken.ts";

const base =
  typeof window !== "undefined"
    ? window.location.origin
    : "http://localhost:3000";

const api = axios.create({
  baseURL: `${base}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${getStoredAccessToken()}`;
  return config;
});

export default api;
