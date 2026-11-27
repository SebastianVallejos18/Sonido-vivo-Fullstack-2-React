import { textoEstado, siguienteEstado, itemsParaApi, revisarStock } from './pedidos'

describe('utils de pedidos', () => {
  it('textoEstado traduce el código de la API a texto', () => {
    expect(textoEstado('EN_PREPARACION')).toBe('En preparación')
    expect(textoEstado('DESPACHADO')).toBe('Despachado')
    expect(textoEstado('ENTREGADO')).toBe('Entregado')
  })

  it('siguienteEstado avanza en orden y termina en ENTREGADO', () => {
    expect(siguienteEstado('EN_PREPARACION')).toBe('DESPACHADO')
    expect(siguienteEstado('DESPACHADO')).toBe('ENTREGADO')
    expect(siguienteEstado('ENTREGADO')).toBeNull()
    expect(siguienteEstado('OTRO')).toBeNull()
  })

  it('itemsParaApi convierte el carrito al formato de la API', () => {
    const carrito = [{ id: 5, nombre: 'Guitarra', precio: '$100', cantidad: 2 }]
    expect(itemsParaApi(carrito)).toEqual([{ producto_id: 5, cantidad: 2 }])
  })

  it('itemsParaApi rechaza un carrito vacío o con productos sin id', () => {
    expect(() => itemsParaApi([])).toThrow('No se puede crear un pedido sin productos')
    expect(() => itemsParaApi([{ nombre: 'Viejo', cantidad: 1 }])).toThrow(/productos antiguos/)
  })
})

describe('revisarStock', () => {
  const categorias = [
    { id: 'guitarras', titulo: 'Guitarras', productos: [
      { id: 1, nombre: 'Folk', stock: 5 },
      { id: 2, nombre: 'SG', stock: 0 },
      { id: 3, nombre: 'Strato', stock: 2 },
    ] },
  ]

  it('no devuelve problemas si todo alcanza', () => {
    expect(revisarStock([{ id: 1, nombre: 'Folk', cantidad: 5 }], categorias)).toEqual([])
  })

  it('avisa los productos agotados, con poco stock o que ya no existen', () => {
    const carrito = [
      { id: 2, nombre: 'SG', cantidad: 1 },
      { id: 3, nombre: 'Strato', cantidad: 3 },
      { id: 99, nombre: 'Borrado', cantidad: 1 },
      { nombre: 'Antiguo', cantidad: 1 },
    ]
    expect(revisarStock(carrito, categorias)).toEqual([
      '"SG" está agotado.',
      'Solo quedan 2 unidades de "Strato".',
      '"Borrado" ya no está disponible. Quítalo del carrito.',
      '"Antiguo" ya no está disponible. Quítalo del carrito.',
    ])
  })
})