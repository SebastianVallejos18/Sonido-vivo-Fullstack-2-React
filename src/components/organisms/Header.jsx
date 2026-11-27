import { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { contarProductos } from "../../services/carritoService";
import { obtenerSesion, cerrarSesion, tieneRol, EVENTO_SESION } from "../../services/authService";


function Header() {
  const [cantidad, setCantidad] = useState(contarProductos);
  const [sesion, setSesion] = useState(obtenerSesion);
  const navigate = useNavigate();

  // Carrito: cuando se agrega o quita un producto, se vuelve a contar.
  useEffect(() => {
    function actualizar() {
      setCantidad(contarProductos());
    }

    window.addEventListener("carrito-actualizado", actualizar);

    return () => {
      window.removeEventListener("carrito-actualizado", actualizar);
    };
  }, []);

  // Sesión: cuando alguien inicia o cierra sesión, se vuelve a leer.
  useEffect(() => {
    function actualizarSesion() {
      setSesion(obtenerSesion());
    }

    window.addEventListener(EVENTO_SESION, actualizarSesion);

    return () => {
      window.removeEventListener(EVENTO_SESION, actualizarSesion);
    };
  }, []);

  function handleCerrarSesion() {
    cerrarSesion();
    navigate("/");
  }

  return (
    <Navbar expand="md" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fs-2 fw-bold">
          Sonido Vivo
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="menu-principal" />

        <Navbar.Collapse id="menu-principal">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/" end>
              Inicio
            </Nav.Link>
            
            <Nav.Link as={NavLink} to="/catalogo">
              Productos
            </Nav.Link>

            <Nav.Link as={NavLink} to="/ofertas">
              Ofertas
            </Nav.Link>

            <Nav.Link as={NavLink} to="/contact">
              Contacto
            </Nav.Link>

            <Nav.Link as={NavLink} to="/carrito">
              Carrito
              {cantidad > 0 ? (
                <span
                  className="badge rounded-pill bg-primary ms-1"
                  data-testid="contador-carrito"
                >
                  {cantidad}
                </span>
              ) : null}
            </Nav.Link>

          {tieneRol(sesion, "CLIENTE") ? (
            <Nav.Link as={NavLink} to="/mis-pedidos">
              Mis pedidos
            </Nav.Link>
          ) : null}
          {tieneRol(sesion, "ADMIN", "VENDEDOR") ? (
            <Nav.Link as={NavLink} to="/vendedor/pedidos">
              Pedidos
            </Nav.Link>
          ) : null}

          {tieneRol(sesion, "ADMIN") ? (
            <Nav.Link as={NavLink} to="/admin">Administración</Nav.Link>
          ) : null}
          {sesion ? (
            <>
              <Navbar.Text className="ms-md-3">Hola, {sesion.usuario.nombre}</Navbar.Text>
              <Nav.Link as="button" type="button" onClick={handleCerrarSesion}>
                Cerrar sesión
              </Nav.Link>
            </>
          ) : (
            <Nav.Link as={NavLink} to="/login">Iniciar sesión</Nav.Link>
          )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;