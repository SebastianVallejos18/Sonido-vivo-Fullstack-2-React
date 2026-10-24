import { Link } from "react-router-dom";
import CartItem from "../molecules/CartItem";
import CartSummary from "../molecules/CartSummary";
import { calcularTotal } from "../../utils/precios";

function CartList(props) {
  if (props.items.length === 0) {
    return (
      <section className="container text-center my-5">
        <h2 className="mb-3">Tu carrito está vacío</h2>
        <p className="mb-4">Agrega productos desde el catálogo para comenzar tu pedido.</p>
        <Link to="/catalogo" className="btn btn-primary">
          Ver productos
        </Link>
      </section>
    );
  }

  let unidades = 0;
  for (const item of props.items) {
    unidades = unidades + item.cantidad;
  }

  return (
    <section className="container my-4">
      <h2 className="mb-4">Mi carrito</h2>

      <div className="row g-4">
        <div className="col-12 col-lg-8">
          {props.items.map((item) => (
            <CartItem
              key={item.nombre}
              image={item.imagen}
              text={item.nombre}
              price={item.precio}
              quantity={item.cantidad}
              onIncrease={() => props.onIncrease(item.nombre)}
              onDecrease={() => props.onDecrease(item.nombre)}
              onRemove={() => props.onRemove(item.nombre)}
            />
          ))}
        </div>

        <div className="col-12 col-lg-4">
          <CartSummary
            total={calcularTotal(props.items)}
            itemCount={unidades}
            onConfirm={props.onConfirm}
          />
        </div>
      </div>
    </section>
  );
}

export default CartList;