import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import OffersPage from './OffersPage'

vi.mock('../data/productos', () => ({
  default: [
    {
      id: 'guitarras',
      titulo: 'Guitarras',
      productos: [
        { nombre: 'Guitarra Simple', imagen: '/guitarra.jpeg', precio: '$100.000', descripcion: 'Sin descuento.' },
      ],
    },
  ],
}))

describe('OffersPage sin ofertas', () => {
  it('muestra un aviso cuando no hay productos en oferta', () => {
    render(
      <MemoryRouter>
        <OffersPage />
      </MemoryRouter>
    )

    expect(screen.getByText('Por ahora no hay productos en oferta.')).toBeInTheDocument()
    expect(screen.queryAllByRole('heading', { level: 3 })).toHaveLength(0)
  })
})