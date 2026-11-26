import { destinoSegunSesion } from "./rutas";

function sesionCon(rol) {
  return { token: "x", usuario: { id: 1, nombre: "Prueba", rol } };
}

describe("destinoSegunSesion", () => {
  it("sin sesión manda al login", () => {
    expect(destinoSegunSesion(null, ["ADMIN"])).toBe("/login");
  });

  it.each(["CLIENTE", "VENDEDOR"])("un %s va a /sin-permiso en una ruta de ADMIN", (rol) => {
    expect(destinoSegunSesion(sesionCon(rol), ["ADMIN"])).toBe("/sin-permiso");
  });

  it("un ADMIN puede entrar", () => {
    expect(destinoSegunSesion(sesionCon("ADMIN"), ["ADMIN"])).toBeNull();
  });

  it("si la ruta no pide roles, basta con tener sesión", () => {
    expect(destinoSegunSesion(sesionCon("CLIENTE"))).toBeNull();
  });
});