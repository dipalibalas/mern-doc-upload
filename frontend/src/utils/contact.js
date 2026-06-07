const trimUrl = (url) => (url ? String(url).trim().replace(/\/+$/, "") : "");

const backendUrl =
  trimUrl(import.meta.env.VITE_BACKEND_URL) || "http://localhost:5000";

export const BASE_URL =
  trimUrl(import.meta.env.VITE_API_URL) || `${backendUrl}/api`;

export const UPLOADS_URL =
  trimUrl(import.meta.env.VITE_UPLOADS_URL) || `${backendUrl}/uploads`;

export const config = {
  apiUrl: BASE_URL,
  uploadsUrl: UPLOADS_URL,
};
