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