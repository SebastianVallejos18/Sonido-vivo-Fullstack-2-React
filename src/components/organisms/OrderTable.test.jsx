import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import OrderTable from './OrderTable'

const pedidos = [
  { id: 1, fecha: '2026-11-27T12:00:00Z', cliente: 'Ana', metodo: 'despacho', total: 129990, codigoEstado: 'EN_PREPARACION', estado: 'En preparación' },
  { id: 2, fecha: '2026-11-27T12:00:00Z', cliente: 'Beto', metodo: 'retiro', total: 8990, codigoEstado: 'ENTREGADO', estado: 'Entregado' },
]

function renderTabla(props) {
  return render(
    <MemoryRouter>
      <OrderTable pedidos={pedidos} {...props} />
    </MemoryRouter>
  )
}

describe('OrderTable', () => {
  it('avisa cuando no hay pedidos', () => {
    render(<MemoryRouter><OrderTable pedidos={[]} /></MemoryRouter>)
    expect(screen.getByText('No hay pedidos para mostrar.')).toBeInTheDocument()
  })

  it('muestra cada pedido con su total, entrega y estado', () => {
    renderTabla()
    expect(screen.getByText('#1')).toBeInTheDocument()
    expect(screen.getByText('$129.990')).toBeInTheDocument()
    expect(screen.getByText('Retiro en tienda')).toBeInTheDocument()
    expect(screen.getByText('En preparación')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ver detalle del pedido 1' })).toHaveAttribute('href', '/pedidos/1')
  })

  it('sin mostrarCliente no muestra la columna Cliente ni botones de estado', () => {
    renderTabla()
    expect(screen.queryByRole('columnheader', { name: 'Cliente' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('en modo vendedor muestra el cliente y el botón para avanzar solo si hay siguiente estado', async () => {
    const user = userEvent.setup()
    const fakeAvanzar = vi.fn()
    renderTabla({ mostrarCliente: true, onAvanzar: fakeAvanzar })

    expect(screen.getByRole('columnheader', { name: 'Cliente' })).toBeInTheDocument()
    expect(screen.getAllByRole('button')).toHaveLength(1) // el entregado no tiene botón

    await user.click(screen.getByRole('button', { name: 'Marcar pedido 1 como Despachado' }))
    expect(fakeAvanzar).toHaveBeenCalledWith(pedidos[0], 'DESPACHADO')
  })
})