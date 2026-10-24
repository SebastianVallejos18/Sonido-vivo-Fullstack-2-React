import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import OrderSuccess from './OrderSuccess'

const pedido = {
  id: 3,
  estado: 'En preparación',
  metodo: 'despacho',
  direccion: 'Av. Libertad 123',
  total: 155970,
}

function renderSuccess(datos) {
  return render(
    <MemoryRouter>
      <OrderSuccess pedido={datos} />
    </MemoryRouter>
  )
}

describe('OrderSuccess', () => {
  it('muestra el título de confirmación', () => {
    renderSuccess(pedido)
    expect(screen.getByRole('heading', { name: '¡Pedido confirmado!' })).toBeInTheDocument()
  })

  it('muestra el número, el estado y el total del pedido', () => {
    renderSuccess(pedido)

    expect(screen.getByText('Número de pedido: #3')).toBeInTheDocument()
    expect(screen.getByText('Estado: En preparación')).toBeInTheDocument()
    expect(screen.getByText('Total: $155.970')).toBeInTheDocument()
  })

  it('muestra la dirección cuando es despacho', () => {
    renderSuccess(pedido)
    expect(screen.getByText('Despacho a: Av. Libertad 123')).toBeInTheDocument()
  })

  it('indica retiro en tienda cuando es retiro', () => {
    renderSuccess({ ...pedido, metodo: 'retiro', direccion: '' })

    expect(screen.getByText('Retiro en tienda')).toBeInTheDocument()
    expect(screen.queryByText(/Despacho a:/)).not.toBeInTheDocument()
  })

  it('tiene un enlace para volver al inicio', () => {
    renderSuccess(pedido)
    expect(screen.getByRole('link', { name: 'Volver al inicio' })).toHaveAttribute('href', '/')
  })
})