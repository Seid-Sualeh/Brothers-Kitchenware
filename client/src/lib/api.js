import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "";

export const api = axios.create({
  baseURL: baseURL || undefined,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function apiUrl(path) {
  const p = path.startsWith("/") ? path : `/${path}`;
  if (baseURL) return `${baseURL}${p}`;
  return p;
}
