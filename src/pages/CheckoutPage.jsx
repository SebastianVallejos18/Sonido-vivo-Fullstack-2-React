import { useState } from "react";
import { Link } from "react-router-dom";
import HomePageTemplate from "../components/templates/HomePageTemplate";
import { obtenerCarrito, vaciarCarrito } from "../services/carritoService";
import { crearPedido } from "../services/pedidosService";
import { calcularTotal } from "../utils/precios";
import OrderForm from "../components/organisms/OrderForm";
import OrderSuccess from "../components/molecules/OrderSucces";
import OrderSummary from "../components/molecules/OrderSummary";

function CheckoutPage() {
  const [items] = useState(obtenerCarrito);
  const [pedido, setPedido] = useState(null);

  function handleSubmit(datos) {
    const nuevoPedido = crearPedido(datos, items);
    vaciarCarrito();
    setPedido(nuevoPedido);
  }

  let contenido;

  if (pedido) {
    contenido = <OrderSuccess pedido={pedido} />;
  } else if (items.length === 0) {
    contenido = (
      <section className="container text-center my-5">
        <h2 className="mb-3">No hay productos para confirmar</h2>
        <p className="mb-4">
          Agrega productos a tu carrito antes de confirmar un pedido.
        </p>
        <Link to="/catalogo" className="btn btn-primary">
          Ver productos
        </Link>
      </section>
    );
  } else {
    contenido = (
      <div className="container my-4">
        <h2 className="mb-4">Confirmar pedido</h2>
        <div className="row g-4">
          <div className="col-12 col-lg-7">
            <OrderForm onSubmit={handleSubmit} />
          </div>
          <div className="col-12 col-lg-5">
            <OrderSummary items={items} total={calcularTotal(items)} />
          </div>
        </div>
      </div>
    );
  }

  return <HomePageTemplate content={contenido} />;
}

export default CheckoutPage;