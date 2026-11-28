import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import ProductsAdminPage from './ProductsAdminPage'
import {
  obtenerProductos,
  obtenerCategorias,
  crearProducto,
  actualizarProducto,
  desactivarProducto,
} from '../services/productosService'

// La página se prueba sin API: el servicio se reemplaza por funciones falsas
vi.mock('../services/productosService', () => ({
  obtenerProductos: vi.fn(),
  obtenerCategorias: vi.fn(),
  crearProducto: vi.fn(),
  actualizarProducto: vi.fn(),
  desactivarProducto: vi.fn(),
}))

const categorias = [{ id: 1, slug: 'guitarras', titulo: 'Guitarras' }]
const productos = [
  { id: 1, nombre: 'Guitarra Folk', descripcion: '', categoria: 'Guitarras', precio: 129990, stock: 10, descuento: 0, imagen: '/guitarra.jpeg' },
]

function guardarSesion(rol) {
  const payload = { exp: Math.floor(Date.now() / 1000) + 3600 }
  const token = 'x.' + btoa(JSON.stringify(payload)) + '.firma'
  localStorage.setItem('sesion', JSON.stringify({ token, usuario: { id: 1, nombre: 'Prueba', rol } }))
}

function renderPage() {
  return render(
    <MemoryRouter>
      <ProductsAdminPage />
    </MemoryRouter>
  )
}

describe('ProductsAdminPage', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
    obtenerProductos.mockResolvedValue(productos)
    obtenerCategorias.mockResolvedValue(categorias)
  })

  it('carga productos y categorías desde la API', async () => {
    guardarSesion('VENDEDOR')
    renderPage()

    expect(screen.getByText('Cargando productos...')).toBeInTheDocument()
    expect(await screen.findByText('Guitarra Folk')).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Guitarras' })).toBeInTheDocument()
  })

  it('el VENDEDOR no ve el botón Desactivar; el ADMIN sí', async () => {
    guardarSesion('VENDEDOR')
    const { unmount } = renderPage()
    await screen.findByText('Guitarra Folk')
    expect(screen.queryByRole('button', { name: 'Desactivar Guitarra Folk' })).not.toBeInTheDocument()
    unmount()

    guardarSesion('ADMIN')
    renderPage()
    expect(await screen.findByRole('button', { name: 'Desactivar Guitarra Folk' })).toBeInTheDocument()
  })

  it('crea un producto y recarga la lista', async () => {
    const user = userEvent.setup()
    guardarSesion('VENDEDOR')
    crearProducto.mockResolvedValue({})
    renderPage()
    await screen.findByText('Guitarra Folk')

    await user.type(screen.getByLabelText('Nombre'), 'Ukelele')
    await user.selectOptions(screen.getByLabelText('Categoría'), 'Guitarras')
    await user.type(screen.getByLabelText('Precio ($)'), '49990')
    await user.type(screen.getByLabelText('Stock'), '5')
    await user.click(screen.getByRole('button', { name: 'Crear producto' }))

    expect(crearProducto).toHaveBeenCalledWith(expect.objectContaining({ nombre: 'Ukelele', stock: '5' }), categorias)
    expect(await screen.findByRole('status')).toHaveTextContent('Producto creado correctamente.')
    expect(obtenerProductos).toHaveBeenCalledTimes(2)
  })

  it('edita el stock de un producto', async () => {
    const user = userEvent.setup()
    guardarSesion('VENDEDOR')
    actualizarProducto.mockResolvedValue({})
    renderPage()

    await user.click(await screen.findByRole('button', { name: 'Editar Guitarra Folk' }))
    const campoStock = screen.getByLabelText('Stock')
    await user.clear(campoStock)
    await user.type(campoStock, '25')
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    expect(actualizarProducto).toHaveBeenCalledWith(1, expect.objectContaining({ stock: '25' }), categorias)
    expect(await screen.findByRole('status')).toHaveTextContent('Producto actualizado correctamente.')
  })

  it('el ADMIN desactiva un producto', async () => {
    const user = userEvent.setup()
    guardarSesion('ADMIN')
    desactivarProducto.mockResolvedValue()
    renderPage()

    await user.click(await screen.findByRole('button', { name: 'Desactivar Guitarra Folk' }))

    expect(desactivarProducto).toHaveBeenCalledWith(1)
    expect(await screen.findByRole('status')).toHaveTextContent('Producto desactivado')
  })

  it('muestra el error de la API (ej: nombre repetido)', async () => {
    const user = userEvent.setup()
    guardarSesion('VENDEDOR')
    crearProducto.mockRejectedValue({ response: { status: 409, data: { error: 'Ya existe un producto con ese nombre' } } })
    renderPage()
    await screen.findByText('Guitarra Folk')

    await user.type(screen.getByLabelText('Nombre'), 'Guitarra Folk')
    await user.selectOptions(screen.getByLabelText('Categoría'), 'Guitarras')
    await user.type(screen.getByLabelText('Precio ($)'), '1000')
    await user.type(screen.getByLabelText('Stock'), '1')
    await user.click(screen.getByRole('button', { name: 'Crear producto' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Ya existe un producto con ese nombre')
  })
})