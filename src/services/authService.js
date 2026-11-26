import { api } from "./api";

const CLAVE_SESION = "sesion";
export const EVENTO_SESION = "sesion-actualizada";

// Avisa al resto de la app (por ejemplo, al Header) que la sesión cambió.
function avisarCambioSesion() {
  window.dispatchEvent(new Event(EVENTO_SESION));
}

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
  avisarCambioSesion();
  return respuesta.data;
}

// Devuelve la sesión solo si existe y su token sigue vigente.
export function obtenerSesion() {
  try {
    const sesion = JSON.parse(localStorage.getItem(CLAVE_SESION));
    if (!sesion?.token || tokenVencido(sesion.token)) {
      return null;
    }
    return sesion;
  } catch {
    return null;
  }
}

// Lee el campo "exp" del JWT para saber si el token ya venció.
// Solo lo usa la interfaz: la validación real la hace el backend.
export function tokenVencido(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));
    return typeof payload.exp === "number" && payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export function cerrarSesion() {
  localStorage.removeItem(CLAVE_SESION);
  avisarCambioSesion();
}

export function tieneRol(sesion, ...roles) {
  return Boolean(sesion?.usuario && roles.includes(sesion.usuario.rol));
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