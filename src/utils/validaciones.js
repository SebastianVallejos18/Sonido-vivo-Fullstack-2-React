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

  return errores;
}