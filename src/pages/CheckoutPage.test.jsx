import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import CheckoutPage from './CheckoutPage'
import { agregarProducto, obtenerCarrito } from '../services/carritoService'
import { crearPedido } from '../services/pedidosService'

// El pedido se crea en la API: aquí se reemplaza por una función falsa
vi.mock('../services/pedidosService', () => ({ crearPedido: vi.fn() }))

const guitarra = {
  id: 5,
  nombre: 'Guitarra Acústica Folk',
  imagen: '/guitarra.jpeg',
  precio: '$129.990',
}

function guardarSesionCliente() {
  const payload = { exp: Math.floor(Date.now() / 1000) + 3600 }
  const token = 'x.' + btoa(JSON.stringify(payload)) + '.firma'
  localStorage.setItem('sesion', JSON.stringify({
    token,
    usuario: { id: 3, nombre: 'Juan Pérez', email: 'juan@correo.com', rol: 'CLIENTE' },
  }))
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
    vi.clearAllMocks()
    guardarSesionCliente()
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

  it('rellena nombre y correo con los datos de la cuenta', () => {
    agregarProducto(guitarra)
    renderPage()

    expect(screen.getByLabelText('Nombre completo')).toHaveValue('Juan Pérez')
    expect(screen.getByLabelText('Correo electrónico')).toHaveValue('juan@correo.com')
  })

  it('no crea el pedido ni toca el carrito si el formulario es inválido', async () => {
    const user = userEvent.setup()
    agregarProducto(guitarra)
    renderPage()

    await user.click(screen.getByRole('button', { name: 'Confirmar pedido' }))

    expect(screen.getByText(/Ingresa un número chileno válido/)).toBeInTheDocument()
    expect(crearPedido).not.toHaveBeenCalled()
    expect(obtenerCarrito()).toHaveLength(1)
  })

  it('al confirmar: crea el pedido en la API, vacía el carrito y apaga el contador', async () => {
    const user = userEvent.setup()
    crearPedido.mockResolvedValue({ id: 1, metodo: 'despacho', direccion: 'Av. Libertad 123', estado: 'En preparación', total: 259980 })
    agregarProducto(guitarra)
    agregarProducto(guitarra)
    renderPage()

    expect(screen.getByTestId('contador-carrito')).toHaveTextContent('2')

    await user.type(screen.getByLabelText('Número de teléfono'), '+56912345678')
    await user.type(screen.getByLabelText('Dirección de despacho'), 'Av. Libertad 123')
    await user.click(screen.getByRole('button', { name: 'Confirmar pedido' }))

    expect(await screen.findByRole('heading', { name: '¡Pedido confirmado!' })).toBeInTheDocument()
    expect(screen.getByText('Número de pedido: #1')).toBeInTheDocument()
    expect(crearPedido).toHaveBeenCalledWith(
      expect.objectContaining({ telefono: '+56912345678', metodo: 'despacho', direccion: 'Av. Libertad 123' }),
      [{ id: 5, nombre: 'Guitarra Acústica Folk', imagen: '/guitarra.jpeg', precio: '$129.990', cantidad: 2 }]
    )
    expect(obtenerCarrito()).toEqual([])
    expect(screen.queryByTestId('contador-carrito')).not.toBeInTheDocument()
  })

  it('si la API rechaza el pedido (sin stock) muestra el error y conserva el carrito', async () => {
    const user = userEvent.setup()
    crearPedido.mockRejectedValue({ response: { status: 409, data: { error: 'Stock insuficiente para "Guitarra Acústica Folk" (quedan 1)' } } })
    agregarProducto(guitarra)
    agregarProducto(guitarra)
    renderPage()

    await user.type(screen.getByLabelText('Número de teléfono'), '+56912345678')
    await user.click(screen.getByLabelText(/Retiro en tienda/))
    await user.click(screen.getByRole('button', { name: 'Confirmar pedido' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Stock insuficiente')
    expect(obtenerCarrito()).toHaveLength(1)
    expect(obtenerCarrito()[0].cantidad).toBe(2)
  })
})