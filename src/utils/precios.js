

export function parsearPrecio(texto) {
  const soloDigitos = String(texto).replace(/\D/g, "");
  return Number(soloDigitos);
}

export function formatearPrecio(numero) {
  const conPuntos = String(Math.round(numero)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return "$" + conPuntos;
}

export function calcularTotal(items) {
  let total = 0;
  for (const item of items) {
    total = total + parsearPrecio(item.precio) * item.cantidad;
  }
  return total;
}

export function aplicarDescuento(precio, porcentaje) {
  if (porcentaje < 0 || porcentaje > 100) {
    throw new Error("El porcentaje debe estar entre 0 y 100");
  }
  return Math.round(precio * (1 - porcentaje / 100));
}