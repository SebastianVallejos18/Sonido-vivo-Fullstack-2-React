import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import MyOrdersPage from './MyOrdersPage'
import { obtenerPedidos } from '../services/pedidosService'

vi.mock('../services/pedidosService', () => ({ obtenerPedidos: vi.fn() }))

function renderPage() {
  return render(<MemoryRouter><MyOrdersPage /></MemoryRouter>)
}

describe('MyOrdersPage', () => {
  it('muestra los pedidos del cliente que devuelve la API', async () => {
    obtenerPedidos.mockResolvedValue([
      { id: 4, fecha: '2026-11-27T12:00:00Z', metodo: 'retiro', total: 8990, codigoEstado: 'DESPACHADO', estado: 'Despachado' },
    ])
    renderPage()

    expect(screen.getByText('Cargando pedidos...')).toBeInTheDocument()
    expect(await screen.findByText('#4')).toBeInTheDocument()
    expect(screen.getByText('Despachado')).toBeInTheDocument()
  })

  it('muestra el error si la API falla', async () => {
    obtenerPedidos.mockRejectedValue({ response: { status: 401, data: { error: 'Token inválido o vencido' } } })
    renderPage()

    expect(await screen.findByRole('alert')).toHaveTextContent('Token inválido o vencido')
  })
})