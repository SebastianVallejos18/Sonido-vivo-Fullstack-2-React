const CLAVE = "carrito";

export function obtenerCarrito() {
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

function guardarCarrito(carrito) {
  localStorage.setItem(CLAVE, JSON.stringify(carrito));
}

export function agregarProducto(producto) {
  const carrito = obtenerCarrito();
  const existente = carrito.find((item) => item.nombre === producto.nombre);

  if (existente) {
    existente.cantidad = existente.cantidad + 1;
  } else {
    carrito.push({
      nombre: producto.nombre,
      imagen: producto.imagen,
      precio: producto.precio,
      cantidad: 1,
    });
  }

  guardarCarrito(carrito);
  return carrito;
}

export function cambiarCantidad(nombre, cantidad) {
  if (!Number.isInteger(cantidad) || cantidad < 1) {
    throw new Error("La cantidad debe ser un entero de al menos 1");
  }

  const carrito = obtenerCarrito();
  const item = carrito.find((elemento) => elemento.nombre === nombre);

  if (!item) {
    throw new Error("El producto no está en el carrito");
  }

  item.cantidad = cantidad;
  guardarCarrito(carrito);
  return carrito;
}

export function quitarProducto(nombre) {
  const carrito = obtenerCarrito().filter((item) => item.nombre !== nombre);
  guardarCarrito(carrito);
  return carrito;
}

export function vaciarCarrito() {
  localStorage.removeItem(CLAVE);
}

// Para mostrar el número en el Header
export function contarProductos() {
  let total = 0;
  for (const item of obtenerCarrito()) {
    total = total + item.cantidad;
  }
  return total;
}