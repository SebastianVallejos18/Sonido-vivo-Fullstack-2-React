import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import OffersPage from './OffersPage'
import { obtenerCarrito } from '../services/carritoService'

function renderOffers() {
  return render(
    <MemoryRouter>
      <OffersPage />
    </MemoryRouter>
  )
}

function tarjetaDe(nombre) {
  return screen.getByRole('heading', { level: 3, name: nombre }).closest('article')
}

describe('OffersPage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('muestra el título y solo los productos con descuento', () => {
    renderOffers()

    expect(screen.getByRole('heading', { level: 2, name: 'Ofertas' })).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(6)
    expect(screen.getByRole('heading', { level: 3, name: 'Guitarra Eléctrica Stratocaster' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 3, name: 'Guitarra Acústica Dreadnought' })).not.toBeInTheDocument()
  })

  it('muestra el precio con descuento, el precio anterior y el porcentaje', () => {
    renderOffers()

    const tarjeta = within(tarjetaDe('Guitarra Acústica Folk'))
    expect(tarjeta.getByText('$103.992')).toBeInTheDocument()
    expect(tarjeta.getByText('$129.990')).toBeInTheDocument()
    expect(tarjeta.getByText('-20%')).toBeInTheDocument()
  })

  it('cada oferta enlaza a su detalle', () => {
    renderOffers()

    expect(screen.getByRole('link', { name: 'Ver detalle de Guitarra Acústica Folk' }))
      .toHaveAttribute('href', '/producto/guitarra-acustica-folk')
  })

  it('al agregar una oferta, el carrito guarda el precio con descuento', async () => {
    const user = userEvent.setup()
    renderOffers()

    const tarjeta = within(tarjetaDe('Guitarra Acústica Folk'))
    await user.click(tarjeta.getByRole('button', { name: 'Agregar al carrito' }))

    expect(obtenerCarrito()[0].precio).toBe('$103.992')
  })
})