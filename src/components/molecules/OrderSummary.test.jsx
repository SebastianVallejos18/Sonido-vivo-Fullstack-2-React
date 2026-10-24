import { render, screen } from '@testing-library/react'
import OrderSummary from './OrderSummary'

const items = [
  { nombre: 'Guitarra Acústica Folk', precio: '$129.990', cantidad: 1 },
  { nombre: 'Cable Instrumento 3m', precio: '$12.990', cantidad: 2 },
]

describe('OrderSummary', () => {
  it('muestra el título del resumen', () => {
    render(<OrderSummary items={items} total={155970} />)
    expect(screen.getByRole('heading', { name: 'Tu pedido' })).toBeInTheDocument()
  })

  it('muestra una línea por cada producto con su cantidad', () => {
    render(<OrderSummary items={items} total={155970} />)

    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByText('Guitarra Acústica Folk x1')).toBeInTheDocument()
    expect(screen.getByText('Cable Instrumento 3m x2')).toBeInTheDocument()
  })

  it('muestra el subtotal de cada producto', () => {
    render(<OrderSummary items={items} total={155970} />)

    expect(screen.getByText('$129.990')).toBeInTheDocument()
    expect(screen.getByText('$25.980')).toBeInTheDocument()
  })

  it('muestra el total con formato de pesos', () => {
    render(<OrderSummary items={items} total={155970} />)
    expect(screen.getByText('Total: $155.970')).toBeInTheDocument()
  })
})