import { parsearPrecio, formatearPrecio, aplicarDescuento } from "./precios";

// Recalcula el precio de los productos que tienen descuento.
// Guarda el precio anterior en precioOriginal.
export function aplicarOfertas(categorias) {
  return categorias.map((categoria) => ({
    ...categoria,
    productos: categoria.productos.map((producto) => {
      if (!producto.descuento) {
        return producto;
      }

      const precioFinal = aplicarDescuento(
        parsearPrecio(producto.precio),
        producto.descuento
      );

      return {
        ...producto,
        precio: formatearPrecio(precioFinal),
        precioOriginal: producto.precio,
      };
    }),
  }));
}

// Lista plana con solo los productos que tienen descuento
export function obtenerOfertas(categorias) {
  return categorias
    .flatMap((categoria) => categoria.productos)
    .filter((producto) => producto.descuento);
}