import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import RutaProtegida from "./RutaProtegida";

function guardarSesion(rol, segundosDeVida = 3600) {
  const payload = { exp: Math.floor(Date.now() / 1000) + segundosDeVida };
  const token = "x." + btoa(JSON.stringify(payload)) + ".firma";
  localStorage.setItem("sesion", JSON.stringify({ token, usuario: { id: 1, nombre: "Prueba", rol } }));
}

function renderRuta() {
  return render(
    <MemoryRouter initialEntries={["/admin"]}>
      <Routes>
        <Route path="/admin" element={<RutaProtegida roles={["ADMIN"]} pagina={<p>Panel admin</p>} />} />
        <Route path="/login" element={<p>Página de login</p>} />
        <Route path="/sin-permiso" element={<p>Sin permiso</p>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("RutaProtegida", () => {
  it("manda al login si no hay sesión", () => {
    renderRuta();
    expect(screen.getByText("Página de login")).toBeInTheDocument();
  });

  it("manda al login si el token está vencido", () => {
    guardarSesion("ADMIN", -60);
    renderRuta();
    expect(screen.getByText("Página de login")).toBeInTheDocument();
  });

  it("bloquea a un CLIENTE", () => {
    guardarSesion("CLIENTE");
    renderRuta();
    expect(screen.getByText("Sin permiso")).toBeInTheDocument();
  });

  it("deja pasar a un ADMIN", () => {
    guardarSesion("ADMIN");
    renderRuta();
    expect(screen.getByText("Panel admin")).toBeInTheDocument();
  });
});