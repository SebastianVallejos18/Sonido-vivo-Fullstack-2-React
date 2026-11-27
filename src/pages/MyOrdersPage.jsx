import { useEffect, useState } from "react";
import HomePageTemplate from "../components/templates/HomePageTemplate";
import OrderTable from "../components/organisms/OrderTable";
import { obtenerPedidos } from "../services/pedidosService";
import { obtenerMensajeError } from "../services/authService";

// Historial del cliente: la API solo le devuelve sus propios pedidos
function MyOrdersPage() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerPedidos()
      .then((lista) => setPedidos(lista))
      .catch((e) => setError(obtenerMensajeError(e)))
      .finally(() => setCargando(false));
  }, []);

  let contenido;
  if (error) {
    contenido = <div className="alert alert-danger" role="alert">{error}</div>;
  } else if (cargando) {
    contenido = <p className="text-muted">Cargando pedidos...</p>;
  } else {
    contenido = <OrderTable pedidos={pedidos} />;
  }

  return (
    <HomePageTemplate
      content={
        <div className="container my-4">
          <h2 className="mb-4">Mis pedidos</h2>
          {contenido}
        </div>
      }
    />
  );
}

export default MyOrdersPage;