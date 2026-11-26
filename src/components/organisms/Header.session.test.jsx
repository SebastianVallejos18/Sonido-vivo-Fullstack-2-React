import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Header from "./Header";

const renderHeader = () => render(<MemoryRouter><Header /></MemoryRouter>);

function guardarSesion(rol, nombre = "Usuario Prueba", segundosDeVida = 3600) {
  const payload = { exp: Math.floor(Date.now() / 1000) + segundosDeVida };
  const token = "x." + btoa(JSON.stringify(payload)) + ".firma";
  const sesion = { token, usuario: { id: 1, nombre, rol } };
  localStorage.setItem("sesion", JSON.stringify(sesion));
  return sesion;
}

describe("Header según la sesión", () => {
  it("muestra Administración solo al ADMIN", () => {
    guardarSesion("ADMIN", "Dueño");
    renderHeader();
    expect(screen.getByRole("link", { name: "Administración" })).toHaveAttribute("href", "/admin");
  });

  it.each(["CLIENTE", "VENDEDOR"])("no muestra Administración a un %s", (rol) => {
    guardarSesion(rol);
    renderHeader();
    expect(screen.queryByRole("link", { name: "Administración" })).not.toBeInTheDocument();
  });

  it("cerrar sesión vuelve a mostrar Iniciar sesión", async () => {
    guardarSesion("ADMIN");
    renderHeader();
    await userEvent.click(screen.getByRole("button", { name: "Cerrar sesión" }));
    expect(screen.getByRole("link", { name: "Iniciar sesión" })).toBeInTheDocument();
  });
});