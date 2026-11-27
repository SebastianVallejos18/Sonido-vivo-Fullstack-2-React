import { api } from "./api";
import { itemsParaApi, textoEstado } from "../utils/pedidos";

// DTO de salida: lo que llega de la API -> lo que usan los componentes
function desdeApi(pedido) {
  return {
    id: pedido.id,
    fecha: pedido.creado_en,
    cliente: pedido.cliente,
    correo: pedido.email,
    metodo: pedido.metodo.toLowerCase(), // "despacho" | "retiro"
    direccion: pedido.direccion || "",
    telefono: pedido.telefono,
    codigoEstado: pedido.estado, // EN_PREPARACION, DESPACHADO, ENTREGADO
    estado: textoEstado(pedido.estado), // texto para mostrar
    total: pedido.total,
    items: pedido.items || [],
  };
}

// CREATE: el cliente sale del token; aquí solo van entrega, teléfono y productos
export async function crearPedido(datos, carrito) {
  const cuerpo = {
    metodo: datos.metodo.toUpperCase(),
    telefono: datos.telefono.trim().replaceAll(" ", ""),
    items: itemsParaApi(carrito),
  };
  if (datos.metodo === "despacho") {
    cuerpo.direccion = datos.direccion.trim();
  }
  const respuesta = await api.post("/pedidos", cuerpo);
  return desdeApi(respuesta.data);
}

// READ: la API devuelve solo los del cliente, o todos si es vendedor/admin
export async function obtenerPedidos() {
  const respuesta = await api.get("/pedidos");
  return respuesta.data.map(desdeApi);
}

export async function obtenerPedido(id) {
  const respuesta = await api.get("/pedidos/" + id);
  return desdeApi(respuesta.data);
}

// UPDATE: solo vendedor/admin; el estado solo avanza
export async function cambiarEstado(id, codigoEstado) {
  const respuesta = await api.patch("/pedidos/" + id + "/estado", { estado: codigoEstado });
  return desdeApi(respuesta.data);
}