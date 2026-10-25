import { normalizarTexto } from "./filtros";

// "Guitarra Acústica Folk" -> "guitarra-acustica-folk"
export function crearSlug(nombre) {
  return normalizarTexto(nombre)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Busca un producto por su slug en todas las categorías
export function buscarProducto(categorias, slug) {
  for (const categoria of categorias) {
    for (const producto of categoria.productos) {
      if (crearSlug(producto.nombre) === slug) {
        return { ...producto, categoria: categoria.titulo };
      }
    }
  }
  return null;
}