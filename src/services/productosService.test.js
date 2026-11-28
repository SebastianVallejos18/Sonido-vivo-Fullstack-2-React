import { api } from './api'
import {
  obtenerCatalogo,
  obtenerProductos,
  obtenerCategorias,
  crearProducto,
  actualizarProducto,
  desactivarProducto,
} from './productosService'

vi.mock('./api', () => ({ api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() } }))

const productoApi = {
  id: 1, nombre: 'Guitarra Folk', descripcion: 'd', imagen: '/g.jpeg', precio: 129990, stock: 10,
  descuento: 20, activo: true, categoria_id: 1, categoria_slug: 'guitarras', categoria: 'Guitarras',
}
const categorias = [{ id: 1, slug: 'guitarras', titulo: 'Guitarras' }, { id: 2, slug: 'bajos', titulo: 'Bajos' }]
const formulario = {
  nombre: ' Ukelele ', descripcion: ' Caoba ', precio: '49990', stock: '5',
  descuento: '0', categoria: 'Bajos', imagen: '/bajo.jpeg',
}

describe('productosService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('obtenerCatalogo pide GET /productos y agrupa por categoría', async () => {
    api.get.mockResolvedValue({ data: [productoApi] })

    const catalogo = await obtenerCatalogo()

    expect(api.get).toHaveBeenCalledWith('/productos')
    expect(catalogo[0].titulo).toBe('Guitarras')
    expect(catalogo[0].productos[0].precio).toBe('$129.990')
  })

  it('obtenerProductos devuelve la lista plana con precio numérico', async () => {
    api.get.mockResolvedValue({ data: [productoApi] })

    const productos = await obtenerProductos()

    expect(productos[0]).toEqual({
      id: 1, nombre: 'Guitarra Folk', descripcion: 'd', precio: 129990, stock: 10,
      imagen: '/g.jpeg', descuento: 20, categoria: 'Guitarras',
    })
  })

  it('obtenerCategorias pide GET /productos/categorias', async () => {
    api.get.mockResolvedValue({ data: categorias })

    expect(await obtenerCategorias()).toEqual(categorias)
    expect(api.get).toHaveBeenCalledWith('/productos/categorias')
  })

  it('crearProducto convierte el formulario a números y categoria_id', async () => {
    api.post.mockResolvedValue({ data: productoApi })

    await crearProducto(formulario, categorias)

    expect(api.post).toHaveBeenCalledWith('/productos', {
      nombre: 'Ukelele', descripcion: 'Caoba', precio: 49990, stock: 5,
      descuento: 0, imagen: '/bajo.jpeg', categoria_id: 2,
    })
  })

  it('actualizarProducto hace PUT /productos/:id', async () => {
    api.put.mockResolvedValue({ data: { ...productoApi, stock: 20 } })

    const producto = await actualizarProducto(1, { ...formulario, stock: '20' }, categorias)

    expect(api.put.mock.calls[0][0]).toBe('/productos/1')
    expect(api.put.mock.calls[0][1].stock).toBe(20)
    expect(producto.stock).toBe(20)
  })

  it('desactivarProducto hace DELETE /productos/:id', async () => {
    api.delete.mockResolvedValue({ data: {} })

    await desactivarProducto(7)

    expect(api.delete).toHaveBeenCalledWith('/productos/7')
  })
})