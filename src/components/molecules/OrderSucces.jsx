import { Link } from "react-router-dom";
import { formatearPrecio } from "../../utils/precios";

function OrderSuccess(props) {
  const esDespacho = props.pedido.metodo === "despacho";

  return (
    <section className="container my-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card shadow-sm p-4 text-center">
            <h2 className="mb-3">¡Pedido confirmado!</h2>
            <p className="mb-1">Número de pedido: #{props.pedido.id}</p>
            <p className="mb-1">Estado: {props.pedido.estado}</p>
            <p className="mb-1">
              {esDespacho
                ? "Despacho a: " + props.pedido.direccion
                : "Retiro en tienda"}
            </p>
            <p className="h5 my-3">Total: {formatearPrecio(props.pedido.total)}</p>
            <Link to="/" className="btn btn-primary">
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OrderSuccess;