import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import CartPage from './CartPage'
import { agregarProducto, obtenerCarrito } from '../services/carritoService'
import { obtenerCatalogo } from '../services/productosService'

vi.mock('../services/productosService', () => ({ obtenerCatalogo: vi.fn() }))

function guardarSesion(rol) {
  const payload = { exp: Math.floor(Date.now() / 1000) + 3600 }
  const token = 'x.' + btoa(JSON.stringify(payload)) + '.firma'
  localStorage.setItem('sesion', JSON.stringify({ token, usuario: { id: 1, nombre: 'Prueba', rol } }))
}

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

describe('CartPage al presionar Confirmar pedido', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
    obtenerCatalogo.mockResolvedValue([
      { id: 'guitarras', titulo: 'Guitarras', productos: [{ id: 5, nombre: 'Guitarra Acústica Folk', precio: '$129.990', stock: 3 }] },
    ])
  })

  function renderConRutas() {
    return render(
      <MemoryRouter initialEntries={['/carrito']}>
        <Routes>
          <Route path="/carrito" element={<CartPage />} />
          <Route path="/confirmacion" element={<p>Pantalla de confirmación</p>} />
          <Route path="/login" element={<p>Pantalla de login</p>} />
        </Routes>
      </MemoryRouter>
    )
  }

  it('si un cliente tiene sesión y hay stock, lleva a la confirmación', async () => {
    const user = userEvent.setup()
    guardarSesion('CLIENTE')
    agregarProducto({ ...guitarra, id: 5 })
    renderConRutas()

    await user.click(screen.getByRole('button', { name: 'Confirmar pedido' }))

    expect(await screen.findByText('Pantalla de confirmación')).toBeInTheDocument()
  })

  it('si no alcanza el stock, avisa en el carrito y no avanza', async () => {
    const user = userEvent.setup()
    guardarSesion('CLIENTE')
    for (let i = 0; i < 4; i++) agregarProducto({ ...guitarra, id: 5 })
    renderConRutas()

    await user.click(screen.getByRole('button', { name: 'Confirmar pedido' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Solo quedan 3 unidades de "Guitarra Acústica Folk".')
    expect(screen.queryByText('Pantalla de confirmación')).not.toBeInTheDocument()
  })

  it('sin sesión manda al login (que después vuelve a la confirmación)', async () => {
    const user = userEvent.setup()
    agregarProducto({ ...guitarra, id: 5 })
    renderConRutas()

    await user.click(screen.getByRole('button', { name: 'Confirmar pedido' }))

    expect(await screen.findByText('Pantalla de login')).toBeInTheDocument()
  })

  it('si la sesión no es de cliente, avisa que solo los clientes compran', async () => {
    const user = userEvent.setup()
    guardarSesion('ADMIN')
    agregarProducto({ ...guitarra, id: 5 })
    renderConRutas()

    await user.click(screen.getByRole('button', { name: 'Confirmar pedido' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Solo las cuentas de cliente pueden hacer pedidos.')
  })
})