import { tieneRol } from "../services/authService";

// Decide a dónde mandar al usuario según su sesión y los roles permitidos.
// Devuelve null si puede entrar.
export function destinoSegunSesion(sesion, roles) {
  if (!sesion) {
    return "/login";
  }
  if (roles && !tieneRol(sesion, ...roles)) {
    return "/sin-permiso";
  }
  return null;
}