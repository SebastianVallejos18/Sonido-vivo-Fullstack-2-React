import { parsearPrecio } from "./precios";

// "Micrófono" -> "microfono"
export function normalizarTexto(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function filtrarCategorias(categorias, filtros) {
  const texto = normalizarTexto(filtros.texto || "");
  const categoriaElegida = filtros.categoria || "";
  // El input entrega texto: "" significa "sin límite"
  const precioMax = filtros.precioMax ? Number(filtros.precioMax) : null;

  return categorias
    .filter((categoria) => categoriaElegida === "" || categoria.titulo === categoriaElegida)
    .map((categoria) => ({
      ...categoria,
      productos: categoria.productos.filter((producto) => {
        const coincideTexto =
          texto === "" ||
          normalizarTexto(producto.nombre).includes(texto) ||
          normalizarTexto(producto.descripcion).includes(texto);

        const coincidePrecio =
          precioMax === null || parsearPrecio(producto.precio) <= precioMax;

        return coincideTexto && coincidePrecio;
      }),
    }))
    .filter((categoria) => categoria.productos.length > 0);
}