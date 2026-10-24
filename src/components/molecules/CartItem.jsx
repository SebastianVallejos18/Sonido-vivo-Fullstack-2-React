import Image from "../atoms/Image";
import Title from "../atoms/Title";
import Button from "../atoms/Button";
import { parsearPrecio, formatearPrecio } from "../../utils/precios";

function CartItem(props) {
  const subtotal = parsearPrecio(props.price) * props.quantity;

  return (
    <article className="card mb-3">
      <div className="row g-0 align-items-center">
        <div className="col-4 col-md-3">
          <Image
            src={props.image}
            alt={props.text}
            className="img-fluid rounded-start"
          />
        </div>

        <div className="col-8 col-md-9">
          <div className="card-body">
            <Title level="h3" className="h5 card-title" text={props.text} />
            <p className="text-muted mb-2">Precio unitario: {props.price}</p>

            <div className="d-flex align-items-center gap-2 mb-2">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                aria-label={"Disminuir cantidad de " + props.text}
                disabled={props.quantity <= 1}
                onClick={props.onDecrease}
              >
                −
              </button>
              <span className="px-2">{props.quantity}</span>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                aria-label={"Aumentar cantidad de " + props.text}
                onClick={props.onIncrease}
              >
                +
              </button>
            </div>

            <p className="fw-semibold mb-2">Subtotal: {formatearPrecio(subtotal)}</p>
            <Button variant="outline-danger" text="Quitar" onClick={props.onRemove} />
          </div>
        </div>
      </div>
    </article>
  );
}

export default CartItem;