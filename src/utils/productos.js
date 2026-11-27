import { normalizarTexto } from "./filtros";
import { formatearPrecio } from "./precios";

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

// Convierte la lista plana de la API en la forma que usa el catálogo:
// [{ id: "slug-categoria", titulo, productos: [{ id, nombre, precio: "$129.990", ... }] }]
// Los productos sin categoría se ignoran.
export function agruparPorCategoria(productos) {
  const categorias = [];

  for (const producto of productos) {
    if (!producto.categoria_slug) {
      continue;
    }

    let categoria = categorias.find((elemento) => elemento.id === producto.categoria_slug);
    if (!categoria) {
      categoria = { id: producto.categoria_slug, titulo: producto.categoria, productos: [] };
      categorias.push(categoria);
    }

    categoria.productos.push({
      id: producto.id,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      imagen: producto.imagen,
      precio: formatearPrecio(producto.precio),
      stock: producto.stock,
      descuento: producto.descuento || undefined,
    });
  }

  return categorias;
}