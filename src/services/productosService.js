import { api } from "./api";
import { agruparPorCategoria } from "../utils/productos";

// Catálogo agrupado por categoría, con la misma forma que usaban las páginas
export async function obtenerCatalogo() {
  const respuesta = await api.get("/productos");
  return agruparPorCategoria(respuesta.data);
}

function productoDesdeApi(producto) {
  return {
    id: producto.id,
    nombre: producto.nombre,
    descripcion: producto.descripcion || "",
    precio: producto.precio,
    stock: producto.stock,
    imagen: producto.imagen,
    descuento: producto.descuento,
    categoria: producto.categoria, 
  };
}


function productoHaciaApi(datos, categorias) {
  const categoria = categorias.find((elemento) => elemento.titulo === datos.categoria);
  return {
    nombre: datos.nombre.trim(),
    descripcion: datos.descripcion.trim(),
    precio: Number(datos.precio),
    stock: Number(datos.stock),
    descuento: Number(datos.descuento),
    imagen: datos.imagen,
    categoria_id: categoria.id,
  };
}

export async function obtenerProductos() {
  const respuesta = await api.get("/productos");
  return respuesta.data.map(productoDesdeApi);
}

export async function obtenerCategorias() {
  const respuesta = await api.get("/productos/categorias");
  return respuesta.data;
}

export async function crearProducto(datos, categorias) {
  const respuesta = await api.post("/productos", productoHaciaApi(datos, categorias));
  return productoDesdeApi(respuesta.data);
}

export async function actualizarProducto(id, datos, categorias) {
  const respuesta = await api.put("/productos/" + id, productoHaciaApi(datos, categorias));
  return productoDesdeApi(respuesta.data);
}

// Borrado lógico: el producto deja de verse en el catálogo (solo ADMIN)
export async function desactivarProducto(id) {
  await api.delete("/productos/" + id);
}