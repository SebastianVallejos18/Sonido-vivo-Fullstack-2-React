import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import CheckoutPage from './CheckoutPage'
import { agregarProducto, obtenerCarrito } from '../services/carritoService'
import { obtenerPedidos } from '../services/pedidosService'

const guitarra = {
  nombre: 'Guitarra Acústica Folk',
  imagen: '/guitarra.jpeg',
  precio: '$129.990',
}

function renderPage() {
  return render(
    <MemoryRouter>
      <CheckoutPage />
    </MemoryRouter>
  )
}

describe('CheckoutPage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('avisa que no hay productos si el carrito está vacío', () => {
    renderPage()

    expect(screen.getByRole('heading', { name: 'No hay productos para confirmar' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ver productos' })).toHaveAttribute('href', '/catalogo')
  })

  it('muestra el formulario y el resumen cuando hay productos', () => {
    agregarProducto(guitarra)
    agregarProducto(guitarra)
    renderPage()

    expect(screen.getByRole('heading', { name: 'Datos del pedido' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Tu pedido' })).toBeInTheDocument()
    expect(screen.getByText('Total: $259.980')).toBeInTheDocument()
  })

  it('no crea el pedido ni toca el carrito si el formulario es inválido', async () => {
    const user = userEvent.setup()
    agregarProducto(guitarra)
    renderPage()

    await user.click(screen.getByRole('button', { name: 'Confirmar pedido' }))

    expect(screen.getByText('Por favor ingresa tu nombre.')).toBeInTheDocument()
    expect(obtenerPedidos()).toEqual([])
    expect(obtenerCarrito()).toHaveLength(1)
  })

  it('al confirmar: crea el pedido, vacía el carrito y apaga el contador', async () => {
    const user = userEvent.setup()
    agregarProducto(guitarra)
    agregarProducto(guitarra)
    renderPage()

    expect(screen.getByTestId('contador-carrito')).toHaveTextContent('2')

    await user.type(screen.getByLabelText('Nombre completo'), 'Juan Pérez')
    await user.type(screen.getByLabelText('Correo electrónico'), 'juan@correo.com')
    await user.type(screen.getByLabelText('Número de teléfono'), '+56912345678')
    await user.type(screen.getByLabelText('Dirección de despacho'), 'Av. Libertad 123')
    await user.click(screen.getByRole('button', { name: 'Confirmar pedido' }))

    expect(screen.getByRole('heading', { name: '¡Pedido confirmado!' })).toBeInTheDocument()
    expect(screen.getByText('Número de pedido: #1')).toBeInTheDocument()

    expect(obtenerPedidos()).toHaveLength(1)
    expect(obtenerCarrito()).toEqual([])
    expect(screen.queryByTestId('contador-carrito')).not.toBeInTheDocument()
  })
})