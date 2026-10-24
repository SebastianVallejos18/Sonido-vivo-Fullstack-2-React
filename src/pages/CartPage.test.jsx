import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import CartPage from './CartPage'
import { agregarProducto, obtenerCarrito } from '../services/carritoService'

const guitarra = {
  nombre: 'Guitarra Acústica Folk',
  imagen: '/guitarra.jpeg',
  precio: '$129.990',
}

function renderPage() {
  return render(
    <MemoryRouter>
      <CartPage />
    </MemoryRouter>
  )
}

describe('CartPage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('muestra el carrito vacío si no hay nada guardado', () => {
    renderPage()
    expect(screen.getByRole('heading', { name: 'Tu carrito está vacío' })).toBeInTheDocument()
  })

  it('muestra los productos que están guardados en el carrito', () => {
    agregarProducto(guitarra)
    renderPage()

    expect(screen.getByRole('heading', { level: 3, name: 'Guitarra Acústica Folk' })).toBeInTheDocument()
    expect(screen.getByText('Total: $129.990')).toBeInTheDocument()
  })

  it('sube la cantidad, actualiza el total y lo guarda', async () => {
    const user = userEvent.setup()
    agregarProducto(guitarra)
    renderPage()

    await user.click(screen.getByRole('button', { name: 'Aumentar cantidad de Guitarra Acústica Folk' }))

    expect(screen.getByText('Total: $259.980')).toBeInTheDocument()
    expect(obtenerCarrito()[0].cantidad).toBe(2)
  })

  it('baja la cantidad y deshabilita el botón al llegar a 1', async () => {
    const user = userEvent.setup()
    agregarProducto(guitarra)
    agregarProducto(guitarra)
    renderPage()

    const botonBajar = screen.getByRole('button', { name: 'Disminuir cantidad de Guitarra Acústica Folk' })
    await user.click(botonBajar)

    expect(screen.getByText('Total: $129.990')).toBeInTheDocument()
    expect(botonBajar).toBeDisabled()
  })

  it('quita el producto, muestra el carrito vacío y lo guarda', async () => {
    const user = userEvent.setup()
    agregarProducto(guitarra)
    renderPage()

    await user.click(screen.getByRole('button', { name: 'Quitar' }))

    expect(screen.getByRole('heading', { name: 'Tu carrito está vacío' })).toBeInTheDocument()
    expect(obtenerCarrito()).toEqual([])
  })
})