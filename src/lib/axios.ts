import axios from "axios";
import { getStoredAccessToken, setStoredAccessToken } from "./authToken.ts";
import { refreshAccessToken } from "#/api/auth.tsx";

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

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;
      try {
        const { accessToken: newToken } = await refreshAccessToken();
        setStoredAccessToken(newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (error) {
        console.error("Refresh token failed");
      }
    }
    return Promise.reject(error);
  },
);

export default api;
