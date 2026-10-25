import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import ProductDetailPage from './ProductDetailPage'
import { obtenerCarrito } from '../services/carritoService'

function renderDetailPage(ruta) {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <Routes>
        <Route path="/producto/:slug" element={<ProductDetailPage />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('ProductDetailPage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('muestra el producto que corresponde al slug de la dirección', () => {
    renderDetailPage('/producto/guitarra-acustica-dreadnought')

    expect(screen.getByRole('heading', { level: 2, name: 'Guitarra Acústica Dreadnought' })).toBeInTheDocument()
    expect(screen.getByText('$189.990')).toBeInTheDocument()
    expect(screen.queryByText(/%/)).not.toBeInTheDocument()
  })

  it('muestra el precio con descuento si el producto está en oferta', () => {
    renderDetailPage('/producto/guitarra-acustica-folk')

    expect(screen.getByText('$103.992')).toBeInTheDocument()
    expect(screen.getByText('$129.990')).toBeInTheDocument()
    expect(screen.getByText('-20%')).toBeInTheDocument()
  })

  it('avisa cuando el producto no existe', () => {
    renderDetailPage('/producto/producto-que-no-existe')

    expect(screen.getByRole('heading', { name: 'Producto no encontrado' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ver productos' })).toHaveAttribute('href', '/catalogo')
  })

  it('al agregar al carrito guarda el precio con descuento', async () => {
    const user = userEvent.setup()
    renderDetailPage('/producto/guitarra-acustica-folk')

    await user.click(screen.getByRole('button', { name: 'Agregar al carrito' }))

    expect(obtenerCarrito()[0].nombre).toBe('Guitarra Acústica Folk')
    expect(obtenerCarrito()[0].precio).toBe('$103.992')
  })

  it('al agregar al carrito sube el contador del Header', async () => {
    const user = userEvent.setup()
    renderDetailPage('/producto/guitarra-acustica-folk')

    await user.click(screen.getByRole('button', { name: 'Agregar al carrito' }))

    expect(screen.getByTestId('contador-carrito')).toHaveTextContent('1')
  })
})