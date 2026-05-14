import axios from "axios";

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

export default api;
