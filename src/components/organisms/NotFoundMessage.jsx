import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

function NotFoundMessage() {
  return (
    <Container className="my-4">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6} className="text-center">
          <div className="card shadow-sm p-4">
            <h1 className="display-1 fw-bold">404</h1>
            <h2 className="mb-3">Página no encontrada</h2>
            <p className="mb-4">
              La dirección que buscas no existe o fue movida.
            </p>
            <div className="d-grid gap-2">
              <Link to="/" className="btn btn-primary">
                Volver al inicio
              </Link>
              <Link to="/catalogo" className="btn btn-outline-secondary">
                Ver productos
              </Link>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default NotFoundMessage;