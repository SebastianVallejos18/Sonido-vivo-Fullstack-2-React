import Button from "../atoms/Button";
import { formatearPrecio } from "../../utils/precios";

function CartSummary(props) {
  return (
    <aside className="card shadow-sm">
      <div className="card-body">
        <h2 className="h4 card-title mb-3">Resumen del pedido</h2>
        <p className="mb-2">Unidades: {props.itemCount}</p>
        <p className="h5 mb-3">Total: {formatearPrecio(props.total)}</p>
        <div className="d-grid">
          <Button variant="primary" text="Confirmar pedido" onClick={props.onConfirm} />
        </div>
      </div>
    </aside>
  );
}

export default CartSummary;