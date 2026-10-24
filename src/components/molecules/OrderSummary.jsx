import { parsearPrecio, formatearPrecio } from "../../utils/precios";

function OrderSummary(props) {
  return (
    <aside className="card shadow-sm">
      <div className="card-body">
        <h2 className="h5 card-title mb-3">Tu pedido</h2>

        <ul className="list-group list-group-flush mb-3">
          {props.items.map((item) => (
            <li
              key={item.nombre}
              className="list-group-item d-flex justify-content-between px-0"
            >
              <span>{item.nombre} x{item.cantidad}</span>
              <span>{formatearPrecio(parsearPrecio(item.precio) * item.cantidad)}</span>
            </li>
          ))}
        </ul>

        <p className="h5 mb-0">Total: {formatearPrecio(props.total)}</p>
      </div>
    </aside>
  );
}

export default OrderSummary;