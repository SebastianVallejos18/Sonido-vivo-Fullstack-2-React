import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import OffersPage from './OffersPage'
import { obtenerCatalogo } from '../services/productosService'

vi.mock('../services/productosService', () => ({ obtenerCatalogo: vi.fn() }))

describe('OffersPage sin ofertas', () => {
  it('muestra un aviso cuando no hay productos en oferta', async () => {
    obtenerCatalogo.mockResolvedValue([
      {
        id: 'guitarras',
        titulo: 'Guitarras',
        productos: [
          { id: 1, nombre: 'Guitarra Simple', imagen: '/guitarra.jpeg', precio: '$100.000', descripcion: 'Sin descuento.' },
        ],
      },
    ])
    render(
      <MemoryRouter>
        <OffersPage />
      </MemoryRouter>
    )

    expect(await screen.findByText('Por ahora no hay productos en oferta.')).toBeInTheDocument()
    expect(screen.queryAllByRole('heading', { level: 3 })).toHaveLength(0)
  })

  it('muestra el error si la API no responde', async () => {
    obtenerCatalogo.mockRejectedValue({ code: 'ERR_NETWORK' })
    render(
      <MemoryRouter>
        <OffersPage />
      </MemoryRouter>
    )

    expect(await screen.findByRole('alert')).toHaveTextContent('No fue posible contactar la API')
  })
})