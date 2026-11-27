import { useState } from "react";
import { Link } from "react-router-dom";
import HomePageTemplate from "../components/templates/HomePageTemplate";
import { obtenerCarrito, vaciarCarrito } from "../services/carritoService";
import { crearPedido } from "../services/pedidosService";
import { calcularTotal } from "../utils/precios";
import OrderForm from "../components/organisms/OrderForm";
import OrderSuccess from "../components/molecules/OrderSuccess";
import OrderSummary from "../components/molecules/OrderSummary";
import { obtenerSesion, obtenerMensajeError } from "../services/authService";

function CheckoutPage() {
  const [items] = useState(obtenerCarrito);
  const [pedido, setPedido] = useState(null);
  const [error, setError] = useState("");
  const sesion = obtenerSesion();

  // El pedido se crea en la API; si falla (ej: sin stock), el carrito no se toca
  async function handleSubmit(datos) {
    try {
      const nuevoPedido = await crearPedido(datos, items);
      vaciarCarrito();
      setPedido(nuevoPedido);
    } catch (e) {
      setError(e.response ? obtenerMensajeError(e) : e.message);
    }
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
        {error ? (
          <div className="alert alert-danger" role="alert">{error}</div>
        ) : null}
        <div className="row g-4">
          <div className="col-12 col-lg-7">
            <OrderForm
              onSubmit={handleSubmit}
              nombre={sesion ? sesion.usuario.nombre : ""}
              correo={sesion ? sesion.usuario.email : ""}
            />
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