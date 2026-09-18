import axios from "axios";

export const getBaseUrl = () => {
  const url = import.meta.env.VITE_API_URL || "http://localhost:8000";
  return url.replace(/\/+$/, "");
};

export const getImageUrl = (imageName) => {
  if (!imageName) return "/for_web_LOGO.png";
  if (imageName.startsWith("http://") || imageName.startsWith("https://")) {
    return imageName;
  }
  return `${getBaseUrl()}/upload/${imageName}`;
};

const api = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
});

export default api;
