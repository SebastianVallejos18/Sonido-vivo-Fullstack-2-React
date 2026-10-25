import { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import { contarProductos } from "../../services/carritoService";

function Header() {
  const [cantidad, setCantidad] = useState(contarProductos);

  useEffect(() => {
    function actualizar() {
      setCantidad(contarProductos());
    }

    window.addEventListener("carrito-actualizado", actualizar);

    return () => {
      window.removeEventListener("carrito-actualizado", actualizar);
    };
  }, []);

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
            <Nav.Link as={NavLink} to="/login">
              Iniciar sesión
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;