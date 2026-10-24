import { useState } from "react";
import HomePageTemplate from "../components/templates/HomePageTemplate";
import CartList from "../components/organisms/CartList";
import { obtenerCarrito, cambiarCantidad, quitarProducto } from "../services/carritoService";

function CartPage() {
  const [items, setItems] = useState(obtenerCarrito);

  function buscarItem(nombre) {
    return items.find((elemento) => elemento.nombre === nombre);
  }

  function handleIncrease(nombre) {
    setItems(cambiarCantidad(nombre, buscarItem(nombre).cantidad + 1));
  }

  function handleDecrease(nombre) {
    setItems(cambiarCantidad(nombre, buscarItem(nombre).cantidad - 1));
  }

  function handleRemove(nombre) {
    setItems(quitarProducto(nombre));
  }

  function handleConfirm() { //TO DO
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
        />
      }
    />
  );
}

export default CartPage;