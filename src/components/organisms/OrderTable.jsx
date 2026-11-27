import { Link } from "react-router-dom";
import { formatearPrecio } from "../../utils/precios";
import { siguienteEstado, textoEstado } from "../../utils/pedidos";

const COLOR_ESTADO = {
  EN_PREPARACION: "bg-warning text-dark",
  DESPACHADO: "bg-info text-dark",
  ENTREGADO: "bg-success",
};

// -- Props
// pedidos: lista de pedidos
// mostrarCliente: true en el panel del vendedor
// onAvanzar: si viene, muestra el botón para avanzar el estado
function OrderTable(props) {
  if (props.pedidos.length === 0) {
    return <p className="text-muted">No hay pedidos para mostrar.</p>;
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead>
          <tr>
            <th scope="col">N°</th>
            <th scope="col">Fecha</th>
            {props.mostrarCliente ? <th scope="col">Cliente</th> : null}
            <th scope="col">Entrega</th>
            <th scope="col">Total</th>
            <th scope="col">Estado</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {props.pedidos.map((pedido) => {
            const siguiente = siguienteEstado(pedido.codigoEstado);
            return (
              <tr key={pedido.id}>
                <td>#{pedido.id}</td>
                <td>{new Date(pedido.fecha).toLocaleDateString("es-CL")}</td>
                {props.mostrarCliente ? <td>{pedido.cliente}</td> : null}
                <td>{pedido.metodo === "despacho" ? "Despacho" : "Retiro en tienda"}</td>
                <td>{formatearPrecio(pedido.total)}</td>
                <td>
                  <span className={"badge " + COLOR_ESTADO[pedido.codigoEstado]}>{pedido.estado}</span>
                </td>
                <td className="d-flex gap-2">
                  <Link
                    to={"/pedidos/" + pedido.id}
                    className="btn btn-sm btn-outline-primary"
                    aria-label={"Ver detalle del pedido " + pedido.id}
                  >
                    Ver detalle
                  </Link>
                  {props.onAvanzar && siguiente ? (
                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      aria-label={"Marcar pedido " + pedido.id + " como " + textoEstado(siguiente)}
                      onClick={() => props.onAvanzar(pedido, siguiente)}
                    >
                      Marcar {textoEstado(siguiente)}
                    </button>
                  ) : null}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default OrderTable;