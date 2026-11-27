import { api } from './api'
import { obtenerCatalogo } from './productosService'

vi.mock('./api', () => ({ api: { get: vi.fn() } }))

describe('productosService', () => {
  it('obtenerCatalogo pide GET /productos y agrupa por categoría', async () => {
    api.get.mockResolvedValue({
      data: [
        { id: 1, nombre: 'Guitarra Folk', descripcion: 'd', imagen: '/g.jpeg', precio: 129990, stock: 10, descuento: 20, categoria_slug: 'guitarras', categoria: 'Guitarras' },
      ],
    })

    const catalogo = await obtenerCatalogo()

    expect(api.get).toHaveBeenCalledWith('/productos')
    expect(catalogo[0].titulo).toBe('Guitarras')
    expect(catalogo[0].productos[0].precio).toBe('$129.990')
  })
})