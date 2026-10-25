import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import CatalogPage from './CatalogPage'
import { obtenerCarrito } from '../services/carritoService'

describe('CatalogPage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('muestra las categorías del catálogo', () => {
    render(
      <MemoryRouter>
        <CatalogPage />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { level: 2, name: 'Guitarras Acústicas' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Micrófonos' })).toBeInTheDocument()
  })

  it('al agregar un producto queda guardado en el carrito y sube el contador', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <CatalogPage />
      </MemoryRouter>
    )

    const titulo = screen.getByRole('heading', { level: 3, name: 'Guitarra Acústica Folk' })
    const tarjeta = titulo.closest('article')
    await user.click(within(tarjeta).getByRole('button', { name: 'Agregar al carrito' }))

    expect(obtenerCarrito()).toHaveLength(1)
    expect(obtenerCarrito()[0].nombre).toBe('Guitarra Acústica Folk')
    expect(screen.getByTestId('contador-carrito')).toHaveTextContent('1')
  })
})

describe('filtros de búsqueda', () => {
  function renderCatalog() {
    return render(
      <MemoryRouter>
        <CatalogPage />
      </MemoryRouter>
    )
  }

  it('filtra los productos al escribir en el buscador', async () => {
    const user = userEvent.setup()
    renderCatalog()

    await user.type(screen.getByLabelText('Buscar producto'), 'stratocaster')

    expect(screen.getByRole('heading', { level: 3, name: 'Guitarra Eléctrica Stratocaster' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 3, name: 'Guitarra Acústica Folk' })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 2, name: 'Micrófonos' })).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('1 producto encontrado')
  })

  it('muestra un mensaje cuando nada coincide', async () => {
    const user = userEvent.setup()
    renderCatalog()

    await user.type(screen.getByLabelText('Buscar producto'), 'zzzz')

    expect(screen.getByText('No se encontraron productos con esos filtros.')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('0 productos encontrados')
  })

  it('muestra solo la categoría elegida', async () => {
    const user = userEvent.setup()
    renderCatalog()

    await user.selectOptions(screen.getByLabelText('Categoría'), 'Micrófonos')

    expect(screen.getByRole('heading', { level: 2, name: 'Micrófonos' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 2, name: 'Guitarras Acústicas' })).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('4 productos encontrados')
  })

  it('filtra por precio máximo', async () => {
    const user = userEvent.setup()
    renderCatalog()

    await user.type(screen.getByLabelText('Precio máximo'), '8000')

    expect(screen.getByRole('heading', { level: 3, name: 'Púas de Guitarra x10 (0.73mm)' })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('1 producto encontrado')
  })

  it('Limpiar filtros vuelve a mostrar todo el catálogo', async () => {
    const user = userEvent.setup()
    renderCatalog()

    await user.type(screen.getByLabelText('Buscar producto'), 'zzzz')
    await user.click(screen.getByRole('button', { name: 'Limpiar filtros' }))

    expect(screen.getByLabelText('Buscar producto')).toHaveValue('')
    expect(screen.getByRole('heading', { level: 2, name: 'Guitarras Acústicas' })).toBeInTheDocument()
    expect(screen.queryByText('No se encontraron productos con esos filtros.')).not.toBeInTheDocument()
  })

  it('se puede agregar al carrito un producto que quedó después de filtrar', async () => {
    const user = userEvent.setup()
    renderCatalog()

    await user.type(screen.getByLabelText('Buscar producto'), 'stratocaster')
    await user.click(screen.getByRole('button', { name: 'Agregar al carrito' }))

    expect(obtenerCarrito()[0].nombre).toBe('Guitarra Eléctrica Stratocaster')
  })

  it('muestra el precio con descuento en los productos en oferta y lo guarda en el carrito', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <CatalogPage />
      </MemoryRouter>
    )

    const tarjeta = screen.getByRole('heading', { level: 3, name: 'Guitarra Acústica Folk' }).closest('article')
    expect(within(tarjeta).getByText('$103.992')).toBeInTheDocument()
    expect(within(tarjeta).getByText('-20%')).toBeInTheDocument()

    await user.click(within(tarjeta).getByRole('button', { name: 'Agregar al carrito' }))

    expect(obtenerCarrito()[0].precio).toBe('$103.992')
  })
})