import roles from "../data/roles";

const patronCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const patronTelefono = /^(\+?56)?9\d{8}$/;

export function validarPedido(datos) {
  const errores = {};

  if (datos.nombre.trim() === "") {
    errores.nombre = "Por favor ingresa tu nombre.";
  }

  if (!patronCorreo.test(datos.correo.trim())) {
    errores.correo = "Ingresa un correo válido, ej: nombre@dominio.com";
  }

  const telefonoLimpio = datos.telefono.trim().replaceAll(" ", "");
  if (!patronTelefono.test(telefonoLimpio)) {
    errores.telefono = "Ingresa un número chileno válido, ej: +56912345678";
  }

  if (datos.metodo === "despacho" && datos.direccion.trim().length < 5) {
    errores.direccion = "Ingresa una dirección de despacho (mínimo 5 caracteres).";
  }

  return errores;
}

export function validarUsuario(datos) {
  const errores = {};

  if (datos.nombre.trim() === "") {
    errores.nombre = "Por favor ingresa el nombre.";
  }

  if (!patronCorreo.test(datos.correo.trim())) {
    errores.correo = "Ingresa un correo válido, ej: nombre@dominio.com";
  }

  if (!roles.includes(datos.rol)) {
    errores.rol = "Selecciona un rol válido.";
  }

  // La contraseña solo se pide al crear (al editar el formulario no la trae)
  if (datos.password !== undefined && datos.password.length < 8) {
    errores.password = "La contraseña debe tener al menos 8 caracteres.";
  }

  return errores;
}



export function validarProducto(datos, categorias) {
  const errores = {};
  const nombre = datos.nombre.trim();

  if (nombre.length < 2 || nombre.length > 100) {
    errores.nombre = "El nombre debe tener entre 2 y 100 caracteres.";
  }

  if (!/^\d+$/.test(String(datos.precio))) {
    errores.precio = "Ingresa un precio en pesos, sin puntos ni decimales.";
  }

  if (!/^\d+$/.test(String(datos.stock))) {
    errores.stock = "El stock debe ser un número entero mayor o igual a 0.";
  }

  const descuento = String(datos.descuento);
  if (!/^\d+$/.test(descuento) || Number(descuento) > 90) {
    errores.descuento = "El descuento debe estar entre 0 y 90.";
  }

  if (!categorias.includes(datos.categoria)) {
    errores.categoria = "Selecciona una categoría.";
  }

  return errores;
}