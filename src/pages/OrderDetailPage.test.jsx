import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import OrderDetailPage from './OrderDetailPage'
import { obtenerPedido } from '../services/pedidosService'

vi.mock('../services/pedidosService', () => ({ obtenerPedido: vi.fn() }))

function renderPage(ruta) {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <Routes>
        <Route path="/pedidos/:id" element={<OrderDetailPage />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('OrderDetailPage', () => {
  it('pide el pedido de la URL y muestra sus productos y total', async () => {
    obtenerPedido.mockResolvedValue({
      id: 7, cliente: 'Ana', correo: 'ana@correo.cl', telefono: '+56912345678', metodo: 'despacho',
      direccion: 'Av. Libertad 123', estado: 'En preparación', total: 259980,
      items: [{ producto_id: 5, nombre: 'Guitarra Folk', cantidad: 2, precio_unitario: 129990 }],
    })
    renderPage('/pedidos/7')

    expect(await screen.findByRole('heading', { name: 'Pedido #7' })).toBeInTheDocument()
    expect(obtenerPedido).toHaveBeenCalledWith('7')
    expect(screen.getByText('2 x Guitarra Folk')).toBeInTheDocument()
    expect(screen.getByText('Despacho a: Av. Libertad 123')).toBeInTheDocument()
    expect(screen.getByText('Total: $259.980')).toBeInTheDocument()
  })

  it('muestra el error si el pedido es de otro cliente (403)', async () => {
    obtenerPedido.mockRejectedValue({ response: { status: 403, data: { error: 'Permiso insuficiente' } } })
    renderPage('/pedidos/99')

    expect(await screen.findByRole('alert')).toHaveTextContent('Permiso insuficiente')
  })
})