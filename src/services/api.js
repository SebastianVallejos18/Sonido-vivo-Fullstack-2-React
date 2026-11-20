import axios from "axios";

// Una instancia comparte dirección base y tiempo máximo entre solicitudes.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1",
  timeout: 10000,
});

// Si hay sesión guardada, cada solicitud lleva el token JWT.
api.interceptors.request.use((config) => {
  try {
    const sesion = JSON.parse(localStorage.getItem("sesion"));
    if (sesion?.token) {
      config.headers.Authorization = "Bearer " + sesion.token;
    }
  } catch {
    // sesión corrupta: se ignora
  }
  return config;
});