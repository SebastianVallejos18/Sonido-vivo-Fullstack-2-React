import { api } from "./api";

const CLAVE_SESION = "sesion";

// DTO de entrada: el formulario usa "correo", la API espera "email".
export async function registrarUsuario({ nombre, correo, password }) {
  const respuesta = await api.post("/auth/registro", {
    nombre: nombre.trim(),
    email: correo.trim().toLowerCase(),
    password,
  });
  return respuesta.data;
}

export async function iniciarSesion({ correo, password }) {
  const respuesta = await api.post("/auth/login", {
    email: correo.trim().toLowerCase(),
    password,
  });
  localStorage.setItem(CLAVE_SESION, JSON.stringify(respuesta.data));
  return respuesta.data;
}

export function obtenerSesion() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_SESION));
  } catch {
    return null;
  }
}

export function cerrarSesion() {
  localStorage.removeItem(CLAVE_SESION);
}

// Tres casos de error: la API respondió, tardó demasiado, o no hubo respuesta.
export function obtenerMensajeError(error) {
  if (error.response) {
    const mensaje = error.response.data?.error;
    return mensaje || "La API respondió con un error (" + error.response.status + ").";
  }
  if (error.code === "ECONNABORTED") {
    return "La API tardó demasiado. Inténtalo de nuevo.";
  }
  return "No fue posible contactar la API. Revisa la conexión, su dirección y CORS.";
}