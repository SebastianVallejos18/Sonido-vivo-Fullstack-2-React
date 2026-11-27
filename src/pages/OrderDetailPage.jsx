import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import HomePageTemplate from "../components/templates/HomePageTemplate";
import { obtenerPedido } from "../services/pedidosService";
import { obtenerMensajeError } from "../services/authService";
import { formatearPrecio } from "../utils/precios";

// Detalle de un pedido. Si un cliente abre uno ajeno, la API responde 403.
function OrderDetailPage() {
  const params = useParams();
  const [pedido, setPedido] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerPedido(params.id)
      .then((encontrado) => setPedido(encontrado))
      .catch((e) => setError(obtenerMensajeError(e)));
  }, [params.id]);

  let contenido;
  if (error) {
    contenido = <div className="alert alert-danger" role="alert">{error}</div>;
  } else if (!pedido) {
    contenido = <p className="text-muted">Cargando pedido...</p>;
  } else {
    contenido = (
      <div className="card shadow-sm p-4">
        <h2 className="h4 mb-3">Pedido #{pedido.id}</h2>
        <p className="mb-1">Cliente: {pedido.cliente} ({pedido.correo})</p>
        <p className="mb-1">Teléfono: {pedido.telefono}</p>
        <p className="mb-1">
          {pedido.metodo === "despacho" ? "Despacho a: " + pedido.direccion : "Retiro en tienda"}
        </p>
        <p className="mb-3">Estado: {pedido.estado}</p>

        <ul className="list-group mb-3">
          {pedido.items.map((item) => (
            <li key={item.producto_id} className="list-group-item d-flex justify-content-between">
              <span>{item.cantidad} x {item.nombre}</span>
              <span>{formatearPrecio(item.precio_unitario * item.cantidad)}</span>
            </li>
          ))}
        </ul>

        <p className="h5">Total: {formatearPrecio(pedido.total)}</p>
      </div>
    );
  }

  return (
    <HomePageTemplate
      content={
        <div className="container my-4">
          {contenido}
          <Link to="/" className="btn btn-outline-secondary mt-3">Volver al inicio</Link>
        </div>
      }
    />
  );
}

export default OrderDetailPage;