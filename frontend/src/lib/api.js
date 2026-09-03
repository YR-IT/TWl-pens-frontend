import axios from "axios";

const BASE = process.env.REACT_APP_BACKEND_URL;
export const API = `${BASE}/api`;

export const api = axios.create({ baseURL: API });

api.interceptors.request.use((cfg) => {
  const t = localStorage.getItem("atelier_token");
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

export function fileUrl(path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith("/api/")) return `${BASE}${path}`;
  return `${API}/files/${path}`;
}
