import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import OrdersPanelPage from './OrdersPanelPage'
import { obtenerPedidos, cambiarEstado } from '../services/pedidosService'

vi.mock('../services/pedidosService', () => ({ obtenerPedidos: vi.fn(), cambiarEstado: vi.fn() }))

const pedido = { id: 1, fecha: '2026-11-27T12:00:00Z', cliente: 'Ana', metodo: 'despacho', total: 129990, codigoEstado: 'EN_PREPARACION', estado: 'En preparación' }

function renderPage() {
  return render(<MemoryRouter><OrdersPanelPage /></MemoryRouter>)
}

describe('OrdersPanelPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    obtenerPedidos.mockResolvedValue([pedido])
  })

  it('muestra todos los pedidos con el nombre del cliente', async () => {
    renderPage()
    expect(await screen.findByText('Ana')).toBeInTheDocument()
  })

  it('avanza el estado de un pedido y actualiza la fila', async () => {
    const user = userEvent.setup()
    cambiarEstado.mockResolvedValue({ ...pedido, codigoEstado: 'DESPACHADO', estado: 'Despachado' })
    renderPage()

    await user.click(await screen.findByRole('button', { name: 'Marcar pedido 1 como Despachado' }))

    expect(cambiarEstado).toHaveBeenCalledWith(1, 'DESPACHADO')
    expect(await screen.findByRole('status')).toHaveTextContent('Pedido #1 marcado como Despachado.')
    expect(screen.getByRole('button', { name: 'Marcar pedido 1 como Entregado' })).toBeInTheDocument()
  })

  it('muestra el error de la API si no se puede cambiar el estado', async () => {
    const user = userEvent.setup()
    cambiarEstado.mockRejectedValue({ response: { status: 409, data: { error: 'El estado solo puede avanzar' } } })
    renderPage()

    await user.click(await screen.findByRole('button', { name: 'Marcar pedido 1 como Despachado' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('El estado solo puede avanzar')
  })
})