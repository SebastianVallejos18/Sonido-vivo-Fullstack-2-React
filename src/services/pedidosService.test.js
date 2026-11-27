import { api } from './api'
import { crearPedido, obtenerPedidos, obtenerPedido, cambiarEstado } from './pedidosService'

vi.mock('./api', () => ({ api: { get: vi.fn(), post: vi.fn(), patch: vi.fn() } }))

const pedidoApi = {
  id: 7, usuario_id: 3, cliente: 'Ana', email: 'ana@correo.cl', metodo: 'DESPACHO',
  direccion: 'Av. Libertad 123', telefono: '+56912345678', estado: 'EN_PREPARACION',
  total: 259980, creado_en: '2026-11-27T04:41:36.093Z',
  items: [{ producto_id: 5, nombre: 'Guitarra', imagen: '/g.jpeg', cantidad: 2, precio_unitario: 129990 }],
}

describe('pedidosService (API con Axios)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('crearPedido hace POST /pedidos con el formato de la API (despacho)', async () => {
    api.post.mockResolvedValue({ data: pedidoApi })

    const pedido = await crearPedido(
      { nombre: 'Ana', correo: 'ana@correo.cl', telefono: '+569 1234 5678', metodo: 'despacho', direccion: ' Av. Libertad 123 ' },
      [{ id: 5, nombre: 'Guitarra', precio: '$129.990', cantidad: 2 }]
    )

    expect(api.post).toHaveBeenCalledWith('/pedidos', {
      metodo: 'DESPACHO',
      telefono: '+56912345678',
      direccion: 'Av. Libertad 123',
      items: [{ producto_id: 5, cantidad: 2 }],
    })
    expect(pedido).toMatchObject({ id: 7, metodo: 'despacho', estado: 'En preparación', codigoEstado: 'EN_PREPARACION', total: 259980 })
  })

  it('crearPedido no envía dirección si es retiro', async () => {
    api.post.mockResolvedValue({ data: { ...pedidoApi, metodo: 'RETIRO', direccion: null } })

    const pedido = await crearPedido(
      { telefono: '+56912345678', metodo: 'retiro', direccion: '' },
      [{ id: 5, cantidad: 1 }]
    )

    expect(api.post.mock.calls[0][1]).not.toHaveProperty('direccion')
    expect(pedido.direccion).toBe('')
  })

  it('crearPedido no llama a la API si el carrito tiene productos sin id', async () => {
    await expect(
      crearPedido({ telefono: '+56912345678', metodo: 'retiro' }, [{ nombre: 'Viejo', cantidad: 1 }])
    ).rejects.toThrow(/productos antiguos/)
    expect(api.post).not.toHaveBeenCalled()
  })

  it('obtenerPedidos hace GET /pedidos', async () => {
    api.get.mockResolvedValue({ data: [pedidoApi] })

    const pedidos = await obtenerPedidos()

    expect(api.get).toHaveBeenCalledWith('/pedidos')
    expect(pedidos[0].cliente).toBe('Ana')
  })

  it('obtenerPedido hace GET /pedidos/:id e incluye los productos', async () => {
    api.get.mockResolvedValue({ data: pedidoApi })

    const pedido = await obtenerPedido(7)

    expect(api.get).toHaveBeenCalledWith('/pedidos/7')
    expect(pedido.items).toHaveLength(1)
  })

  it('cambiarEstado hace PATCH /pedidos/:id/estado', async () => {
    api.patch.mockResolvedValue({ data: { ...pedidoApi, estado: 'DESPACHADO' } })

    const pedido = await cambiarEstado(7, 'DESPACHADO')

    expect(api.patch).toHaveBeenCalledWith('/pedidos/7/estado', { estado: 'DESPACHADO' })
    expect(pedido.estado).toBe('Despachado')
  })
})