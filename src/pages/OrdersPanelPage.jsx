import { useEffect, useState } from "react";
import HomePageTemplate from "../components/templates/HomePageTemplate";
import OrderTable from "../components/organisms/OrderTable";
import { obtenerPedidos, cambiarEstado } from "../services/pedidosService";
import { obtenerMensajeError } from "../services/authService";
import { textoEstado } from "../utils/pedidos";

// Panel de vendedor/admin: ve todos los pedidos y avanza su estado
function OrdersPanelPage() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");

  useEffect(() => {
    obtenerPedidos()
      .then((lista) => setPedidos(lista))
      .catch((e) => setError(obtenerMensajeError(e)))
      .finally(() => setCargando(false));
  }, []);

  async function handleAvanzar(pedido, siguiente) {
    try {
      const actualizado = await cambiarEstado(pedido.id, siguiente);
      // Reemplaza solo el pedido que cambió
      setPedidos(pedidos.map((p) => (p.id === actualizado.id ? actualizado : p)));
      setAviso("Pedido #" + pedido.id + " marcado como " + textoEstado(siguiente) + ".");
      setError("");
    } catch (e) {
      setError(obtenerMensajeError(e));
      setAviso("");
    }
  }

  return (
    <HomePageTemplate
      content={
        <div className="container my-4">
          <h2 className="mb-1">Gestión de pedidos</h2>
          <p className="text-muted mb-4">Revisa los pedidos de los clientes y actualiza su estado.</p>

          {error ? <div className="alert alert-danger" role="alert">{error}</div> : null}
          {aviso ? <div className="alert alert-success" role="status">{aviso}</div> : null}

          {cargando ? (
            <p className="text-muted">Cargando pedidos...</p>
          ) : (
            <OrderTable pedidos={pedidos} mostrarCliente={true} onAvanzar={handleAvanzar} />
          )}
        </div>
      }
    />
  );
}

export default OrdersPanelPage;