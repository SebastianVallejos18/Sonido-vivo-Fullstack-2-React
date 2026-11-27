import { api } from "./api";

// La API usa ADMIN/VENDEDOR/CLIENTE; la interfaz muestra los nombres en español.
const ROL_API = { Administrador: "ADMIN", Vendedor: "VENDEDOR", Cliente: "CLIENTE" };
const ROL_VISTA = { ADMIN: "Administrador", VENDEDOR: "Vendedor", CLIENTE: "Cliente" };

// DTO de salida: lo que llega de la API -> lo que usan los componentes
function desdeApi(usuario) {
  return {
    id: usuario.id,
    nombre: usuario.nombre,
    correo: usuario.email,
    rol: ROL_VISTA[usuario.rol],
    activo: usuario.activo,
  };
}

// DTO de entrada: lo que llena el formulario -> lo que espera la API
function haciaApi(datos) {
  const cuerpo = {
    nombre: datos.nombre.trim(),
    email: datos.correo.trim().toLowerCase(),
    rol: ROL_API[datos.rol],
  };
  if (datos.password) {
    cuerpo.password = datos.password;
  }
  return cuerpo;
}

// READ
export async function obtenerUsuarios() {
  const respuesta = await api.get("/usuarios");
  return respuesta.data.map(desdeApi);
}

// CREATE
export async function crearUsuario(datos) {
  const respuesta = await api.post("/usuarios", haciaApi(datos));
  return desdeApi(respuesta.data);
}

// UPDATE
export async function actualizarUsuario(id, datos) {
  const respuesta = await api.put("/usuarios/" + id, haciaApi(datos));
  return desdeApi(respuesta.data);
}

// DELETE lógico: la API no borra la fila, la desactiva
export async function desactivarUsuario(id) {
  const respuesta = await api.delete("/usuarios/" + id);
  return desdeApi(respuesta.data);
}

export async function activarUsuario(id) {
  const respuesta = await api.patch("/usuarios/" + id + "/activar");
  return desdeApi(respuesta.data);
}