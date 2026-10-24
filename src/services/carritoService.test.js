import {
  obtenerCarrito,
  agregarProducto,
  cambiarCantidad,
  quitarProducto,
  vaciarCarrito,
  contarProductos,
} from './carritoService'

const guitarra = {
  nombre: 'Guitarra Acústica Folk',
  imagen: '/guitarra.jpeg',
  precio: '$129.990',
  descripcion: 'Tapa de abeto, aros y fondo de meranti.',
}

const cable = {
  nombre: 'Cable Instrumento 3m',
  imagen: '/amplificador.jpeg',
  precio: '$12.990',
  descripcion: 'Cable trenzado, conectores dorados, 3 metros.',
}

describe('carritoService (CRUD con persistencia)', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('obtenerCarrito', () => {
    it('devuelve una lista vacía cuando no hay nada guardado', () => {
      expect(obtenerCarrito()).toEqual([])
    })

    it('devuelve una lista vacía si lo guardado está dañado', () => {
      localStorage.setItem('carrito', '{esto no es json')
      expect(obtenerCarrito()).toEqual([])
    })
  })

  describe('agregarProducto', () => {
    it('agrega un producto nuevo con cantidad 1', () => {
      const carrito = agregarProducto(guitarra)

      expect(carrito).toHaveLength(1)
      expect(carrito[0].nombre).toBe('Guitarra Acústica Folk')
      expect(carrito[0].cantidad).toBe(1)
    })

    it('guarda solo nombre, imagen, precio y cantidad', () => {
      const carrito = agregarProducto(guitarra)

      expect(carrito[0]).toEqual({
        nombre: 'Guitarra Acústica Folk',
        imagen: '/guitarra.jpeg',
        precio: '$129.990',
        cantidad: 1,
      })
    })

    it('sube la cantidad en vez de duplicar si el producto ya estaba', () => {
      agregarProducto(guitarra)
      const carrito = agregarProducto(guitarra)

      expect(carrito).toHaveLength(1)
      expect(carrito[0].cantidad).toBe(2)
    })

    it('conserva productos distintos como ítems separados', () => {
      agregarProducto(guitarra)
      const carrito = agregarProducto(cable)

      expect(carrito).toHaveLength(2)
    })

    it('conserva los cambios entre lecturas (persistencia)', () => {
      agregarProducto(guitarra)

      expect(obtenerCarrito()).toHaveLength(1)
      expect(obtenerCarrito()[0].nombre).toBe('Guitarra Acústica Folk')
    })

    it('guarda en localStorage con la clave "carrito"', () => {
      const espia = vi.spyOn(Storage.prototype, 'setItem')

      agregarProducto(guitarra)

      expect(espia).toHaveBeenCalledTimes(1)
      expect(espia).toHaveBeenCalledWith('carrito', expect.any(String))
    })
  })

  describe('cambiarCantidad', () => {
    it('actualiza la cantidad del producto indicado', () => {
      agregarProducto(guitarra)
      const carrito = cambiarCantidad('Guitarra Acústica Folk', 5)

      expect(carrito[0].cantidad).toBe(5)
      expect(obtenerCarrito()[0].cantidad).toBe(5)
    })

    it.each([[0], [-1], [1.5]])('lanza un error si la cantidad es %s', (cantidad) => {
      agregarProducto(guitarra)

      expect(() => cambiarCantidad('Guitarra Acústica Folk', cantidad)).toThrow(
        'La cantidad debe ser un entero de al menos 1'
      )
    })

    it('lanza un error si el producto no está en el carrito', () => {
      expect(() => cambiarCantidad('Producto inexistente', 2)).toThrow(
        'El producto no está en el carrito'
      )
    })
  })

  describe('quitarProducto', () => {
    it('quita solo el producto indicado', () => {
      agregarProducto(guitarra)
      agregarProducto(cable)

      const carrito = quitarProducto('Guitarra Acústica Folk')

      expect(carrito).toHaveLength(1)
      expect(carrito[0].nombre).toBe('Cable Instrumento 3m')
    })

    it('no falla si el producto no estaba en el carrito', () => {
      agregarProducto(guitarra)

      const carrito = quitarProducto('Producto inexistente')

      expect(carrito).toHaveLength(1)
    })
  })

  describe('vaciarCarrito', () => {
    it('deja el carrito vacío', () => {
      agregarProducto(guitarra)
      agregarProducto(cable)

      vaciarCarrito()

      expect(obtenerCarrito()).toEqual([])
    })
  })

  describe('contarProductos', () => {
    it('devuelve 0 con el carrito vacío', () => {
      expect(contarProductos()).toBe(0)
    })

    it('suma las cantidades de todos los ítems', () => {
      agregarProducto(guitarra)
      agregarProducto(guitarra)
      agregarProducto(cable)

      expect(contarProductos()).toBe(3)
    })
  })

  describe('aviso de cambios', () => {
  it('avisa a la interfaz cuando se agrega un producto', () => {
    const escucha = vi.fn()
    window.addEventListener('carrito-actualizado', escucha)

    agregarProducto(guitarra)

    expect(escucha).toHaveBeenCalledTimes(1)
    window.removeEventListener('carrito-actualizado', escucha)
  })

  it('avisa a la interfaz cuando se vacía el carrito', () => {
    const escucha = vi.fn()
    window.addEventListener('carrito-actualizado', escucha)

    vaciarCarrito()

    expect(escucha).toHaveBeenCalledTimes(1)
    window.removeEventListener('carrito-actualizado', escucha)
  })
})
})

