// Estados del pedido en el orden en que avanzan (igual que en el backend)
const ESTADOS = ["EN_PREPARACION", "DESPACHADO", "ENTREGADO"];

const TEXTO_ESTADO = {
  EN_PREPARACION: "En preparación",
  DESPACHADO: "Despachado",
  ENTREGADO: "Entregado",
};

export function textoEstado(codigo) {
  return TEXTO_ESTADO[codigo] || codigo;
}

// Devuelve el estado que sigue, o null si el pedido ya fue entregado
export function siguienteEstado(codigo) {
  const indice = ESTADOS.indexOf(codigo);
  if (indice === -1 || indice === ESTADOS.length - 1) {
    return null;
  }
  return ESTADOS[indice + 1];
}

// Convierte los productos del carrito al formato que espera la API.
// Lanza un error si hay productos guardados antes de conectar la API (sin id).
export function itemsParaApi(carrito) {
  if (carrito.length === 0) {
    throw new Error("No se puede crear un pedido sin productos");
  }
  if (carrito.some((item) => !item.id)) {
    throw new Error("Tu carrito tiene productos antiguos. Vacíalo y vuelve a agregarlos.");
  }
  return carrito.map((item) => ({ producto_id: item.id, cantidad: item.cantidad }));
}

// Compara el carrito con el stock actual del catálogo (forma agrupada por categoría).
// Devuelve una lista de mensajes; si está vacía, todo alcanza.
export function revisarStock(carrito, categorias) {
  const productos = categorias.flatMap((categoria) => categoria.productos);
  const problemas = [];

  for (const item of carrito) {
    const producto = productos.find((elemento) => elemento.id === item.id);
    if (!item.id || !producto) {
      problemas.push(`"${item.nombre}" ya no está disponible. Quítalo del carrito.`);
    } else if (producto.stock === 0) {
      problemas.push(`"${item.nombre}" está agotado.`);
    } else if (producto.stock < item.cantidad) {
      problemas.push(`Solo quedan ${producto.stock} unidades de "${item.nombre}".`);
    }
  }

  return problemas;
}