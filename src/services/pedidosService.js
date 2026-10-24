import { calcularTotal } from "../utils/precios";

const CLAVE = "pedidos";

export function obtenerPedidos() {
  const guardado = localStorage.getItem(CLAVE);
  if (!guardado) {
    return [];
  }
  try {
    return JSON.parse(guardado);
  } catch {
    return [];
  }
}

export function obtenerPedido(id) {
  return obtenerPedidos().find((pedido) => pedido.id === id) || null;
}

export function crearPedido(datos, items) {
  if (items.length === 0) {
    throw new Error("No se puede crear un pedido sin productos");
  }

  const pedidos = obtenerPedidos();
  const ultimoId = pedidos.length > 0 ? pedidos[pedidos.length - 1].id : 0;

  const pedido = {
    id: ultimoId + 1,
    fecha: new Date().toISOString(),
    cliente: {
      nombre: datos.nombre,
      correo: datos.correo,
      telefono: datos.telefono,
    },
    metodo: datos.metodo,
    direccion: datos.metodo === "despacho" ? datos.direccion : "",
    items: items,
    total: calcularTotal(items),
    estado: "En preparación",
  };

  pedidos.push(pedido);
  localStorage.setItem(CLAVE, JSON.stringify(pedidos));
  return pedido;
}