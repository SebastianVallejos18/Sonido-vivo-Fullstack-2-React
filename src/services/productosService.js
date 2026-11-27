import { api } from "./api";
import { agruparPorCategoria } from "../utils/productos";

// Catálogo agrupado por categoría, con la misma forma que usaban las páginas
export async function obtenerCatalogo() {
  const respuesta = await api.get("/productos");
  return agruparPorCategoria(respuesta.data);
}