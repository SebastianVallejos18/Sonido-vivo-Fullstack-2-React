import { useState } from "react";
import HomePageTemplate from "../components/templates/HomePageTemplate";
import CartList from "../components/organisms/CartList";
import { obtenerCarrito, cambiarCantidad, quitarProducto } from "../services/carritoService";
import { useNavigate } from "react-router-dom";
import { obtenerCatalogo } from "../services/productosService";
import { obtenerSesion, tieneRol, obtenerMensajeError } from "../services/authService";
import { revisarStock } from "../utils/pedidos";

function CartPage() {
  const [items, setItems] = useState(obtenerCarrito);
  const [errores, setErrores] = useState([]);

  function buscarItem(nombre) {
    return items.find((elemento) => elemento.nombre === nombre);
  }

  function handleIncrease(nombre) {
    setErrores([]);
    setItems(cambiarCantidad(nombre, buscarItem(nombre).cantidad + 1));
  }

  function handleDecrease(nombre) {
    setErrores([]);
    setItems(cambiarCantidad(nombre, buscarItem(nombre).cantidad - 1));
  }

  function handleRemove(nombre) {
    setErrores([]);
    setItems(quitarProducto(nombre));
  }

  const navigate = useNavigate();

  // Antes de ir al checkout: 1) stock actual en la API, 2) sesión, 3) rol de cliente.
  // El backend vuelve a revisar el stock al crear el pedido (por si alguien compra entre medio).
  async function handleConfirm() {
    try {
      const problemas = revisarStock(items, await obtenerCatalogo());
      if (problemas.length > 0) {
        setErrores(problemas);
        return;
      }
    } catch (e) {
      setErrores([obtenerMensajeError(e)]);
      return;
    }

    const sesion = obtenerSesion();
    if (!sesion) {
      // Después del login vuelve directo al checkout
      navigate("/login", { state: { desde: "/confirmacion" } });
      return;
    }
    if (!tieneRol(sesion, "CLIENTE")) {
      setErrores(["Solo las cuentas de cliente pueden hacer pedidos."]);
      return;
    }

    navigate("/confirmacion");
  }

  return (
    <HomePageTemplate
      content={
        <CartList
          items={items}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
          onRemove={handleRemove}
          onConfirm={handleConfirm}
          errores={errores}
        />
      }
    />
  );
}

export default CartPage;