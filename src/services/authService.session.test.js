import { obtenerSesion, tieneRol, tokenVencido } from "./authService";

function crearToken(segundosDeVida) {
  const payload = { exp: Math.floor(Date.now() / 1000) + segundosDeVida };
  return "x." + btoa(JSON.stringify(payload)) + ".firma";
}

function guardarSesion(rol, nombre = "Usuario Prueba", segundosDeVida = 3600) {
  const sesion = { token: crearToken(segundosDeVida), usuario: { id: 1, nombre, rol } };
  localStorage.setItem("sesion", JSON.stringify(sesion));
  return sesion;
}

describe("authService - sesión y roles", () => {
  it("tokenVencido distingue un token vigente de uno vencido o mal formado", () => {
    expect(tokenVencido(crearToken(3600))).toBe(false);
    expect(tokenVencido(crearToken(-60))).toBe(true);
    expect(tokenVencido("no-es-un-jwt")).toBe(true);
  });

  it("obtenerSesion devuelve null si el token venció", () => {
    guardarSesion("ADMIN", "Admin", -60);
    expect(obtenerSesion()).toBeNull();
  });

  it("obtenerSesion devuelve la sesión si el token es vigente", () => {
    guardarSesion("CLIENTE", "Ana");
    expect(obtenerSesion().usuario.nombre).toBe("Ana");
  });

  it("tieneRol revisa el rol del usuario", () => {
    const sesion = guardarSesion("VENDEDOR");
    expect(tieneRol(sesion, "ADMIN")).toBe(false);
    expect(tieneRol(sesion, "ADMIN", "VENDEDOR")).toBe(true);
    expect(tieneRol(null, "ADMIN")).toBe(false);
  });
});