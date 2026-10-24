import { obtenerPedidos, obtenerPedido, crearPedido } from './pedidosService'

const datos = {
  nombre: 'Juan Pérez',
  correo: 'juan@correo.com',
  telefono: '+56912345678',
  metodo: 'despacho',
  direccion: 'Av. Libertad 123, Viña del Mar',
}

const items = [
  { nombre: 'Guitarra Acústica Folk', imagen: '/guitarra.jpeg', precio: '$129.990', cantidad: 1 },
  { nombre: 'Cable Instrumento 3m', imagen: '/amplificador.jpeg', precio: '$12.990', cantidad: 2 },
]

describe('pedidosService', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('obtenerPedidos', () => {
    it('devuelve una lista vacía si no hay pedidos', () => {
      expect(obtenerPedidos()).toEqual([])
    })

    it('devuelve una lista vacía si lo guardado está dañado', () => {
      localStorage.setItem('pedidos', '{esto no es json')
      expect(obtenerPedidos()).toEqual([])
    })
  })

  describe('crearPedido', () => {
    it('crea el pedido con id 1 y estado "En preparación"', () => {
      const pedido = crearPedido(datos, items)

      expect(pedido.id).toBe(1)
      expect(pedido.estado).toBe('En preparación')
    })

    it('calcula el total del pedido', () => {
      // 129.990 x 1 + 12.990 x 2 = 155.970
      expect(crearPedido(datos, items).total).toBe(155970)
    })

    it('guarda los datos del cliente, los productos y el método', () => {
      const pedido = crearPedido(datos, items)

      expect(pedido.cliente).toEqual({
        nombre: 'Juan Pérez',
        correo: 'juan@correo.com',
        telefono: '+56912345678',
      })
      expect(pedido.items).toHaveLength(2)
      expect(pedido.metodo).toBe('despacho')
      expect(pedido.direccion).toBe('Av. Libertad 123, Viña del Mar')
    })

    it('no guarda dirección cuando el método es retiro', () => {
      const pedido = crearPedido({ ...datos, metodo: 'retiro' }, items)
      expect(pedido.direccion).toBe('')
    })

    it('guarda la fecha del momento en que se crea', () => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2026-10-25T12:00:00.000Z'))

      const pedido = crearPedido(datos, items)

      expect(pedido.fecha).toBe('2026-10-25T12:00:00.000Z')
    })

    it('asigna ids correlativos', () => {
      crearPedido(datos, items)
      const segundo = crearPedido(datos, items)

      expect(segundo.id).toBe(2)
    })

    it('conserva los pedidos entre lecturas (persistencia)', () => {
      crearPedido(datos, items)

      expect(obtenerPedidos()).toHaveLength(1)
    })

    it('lanza un error si no hay productos', () => {
      expect(() => crearPedido(datos, [])).toThrow('No se puede crear un pedido sin productos')
    })
  })

  describe('obtenerPedido', () => {
    it('encuentra un pedido por su id', () => {
      crearPedido(datos, items)
      expect(obtenerPedido(1).cliente.nombre).toBe('Juan Pérez')
    })

    it('devuelve null si el pedido no existe', () => {
      expect(obtenerPedido(99)).toBeNull()
    })
  })
})