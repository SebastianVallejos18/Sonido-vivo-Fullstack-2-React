import { validarUsuario } from "../utils/validaciones";

const CLAVE = "usuarios";

const USUARIOS_INICIALES = [
  { id: 1, nombre: "Dueño Sonido Vivo", correo: "dueno@sonidovivo.cl", rol: "Administrador", activo: true },
  { id: 2, nombre: "Vendedor Uno", correo: "vendedor1@sonidovivo.cl", rol: "Vendedor", activo: true },
  { id: 3, nombre: "Vendedor Dos", correo: "vendedor2@sonidovivo.cl", rol: "Vendedor", activo: true },
  { id: 4, nombre: "Cliente de Prueba", correo: "cliente@correo.com", rol: "Cliente", activo: true },
];

function guardarUsuarios(usuarios) {
  localStorage.setItem(CLAVE, JSON.stringify(usuarios));
}

function existeCorreo(usuarios, correo, idIgnorado) {
  const buscado = correo.trim().toLowerCase();
  return usuarios.some(
    (usuario) => usuario.id !== idIgnorado && usuario.correo.toLowerCase() === buscado
  );
}

function esUltimoAdministradorActivo(usuarios, usuario) {
  if (usuario.rol !== "Administrador" || !usuario.activo) {
    return false;
  }
  const administradoresActivos = usuarios.filter(
    (elemento) => elemento.rol === "Administrador" && elemento.activo
  );
  return administradoresActivos.length === 1;
}

function lanzarSiHayErrores(errores) {
  const mensajes = Object.values(errores);
  if (mensajes.length > 0) {
    throw new Error(mensajes[0]);
  }
}

// READ
export function obtenerUsuarios() {
  const guardado = localStorage.getItem(CLAVE);
  if (!guardado) {
    return USUARIOS_INICIALES.map((usuario) => ({ ...usuario }));
  }
  try {
    return JSON.parse(guardado);
  } catch {
    return USUARIOS_INICIALES.map((usuario) => ({ ...usuario }));
  }
}

export function obtenerUsuario(id) {
  return obtenerUsuarios().find((usuario) => usuario.id === id) || null;
}

// CREATE
export function crearUsuario(datos) {
  lanzarSiHayErrores(validarUsuario(datos));

  const usuarios = obtenerUsuarios();

  if (existeCorreo(usuarios, datos.correo, null)) {
    throw new Error("Ya existe un usuario con ese correo");
  }

  const ultimoId = Math.max(0, ...usuarios.map((usuario) => usuario.id));

  const usuario = {
    id: ultimoId + 1,
    nombre: datos.nombre.trim(),
    correo: datos.correo.trim(),
    rol: datos.rol,
    activo: true,
  };

  usuarios.push(usuario);
  guardarUsuarios(usuarios);
  return usuario;
}

// UPDATE
export function actualizarUsuario(id, cambios) {
  const usuarios = obtenerUsuarios();
  const indice = usuarios.findIndex((usuario) => usuario.id === id);

  if (indice === -1) {
    throw new Error("El usuario no existe");
  }

  const actual = usuarios[indice];
  // El id y el estado nunca se cambian desde aquí
  const actualizado = { ...actual, ...cambios, id: actual.id, activo: actual.activo };

  lanzarSiHayErrores(validarUsuario(actualizado));

  if (existeCorreo(usuarios, actualizado.correo, actual.id)) {
    throw new Error("Ya existe un usuario con ese correo");
  }

  if (actualizado.rol !== actual.rol && esUltimoAdministradorActivo(usuarios, actual)) {
    throw new Error("Debe quedar al menos un administrador activo");
  }

  actualizado.nombre = actualizado.nombre.trim();
  actualizado.correo = actualizado.correo.trim();

  usuarios[indice] = actualizado;
  guardarUsuarios(usuarios);
  return actualizado;
}

function cambiarEstado(id, activo) {
  const usuarios = obtenerUsuarios();
  const usuario = usuarios.find((elemento) => elemento.id === id);

  if (!usuario) {
    throw new Error("El usuario no existe");
  }

  if (!activo && esUltimoAdministradorActivo(usuarios, usuario)) {
    throw new Error("Debe quedar al menos un administrador activo");
  }

  usuario.activo = activo;
  guardarUsuarios(usuarios);
  return usuario;
}

// DELETE lógico: no se borra, se desactiva
export function desactivarUsuario(id) {
  return cambiarEstado(id, false);
}

export function activarUsuario(id) {
  return cambiarEstado(id, true);
}