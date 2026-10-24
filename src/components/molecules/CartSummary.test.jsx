import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CartSummary from './CartSummary'

describe('CartSummary', () => {
  it('muestra el título del resumen', () => {
    render(<CartSummary total={0} itemCount={0} />)
    expect(screen.getByRole('heading', { name: 'Resumen del pedido' })).toBeInTheDocument()
  })

  it('muestra la cantidad de unidades', () => {
    render(<CartSummary total={155970} itemCount={3} />)
    expect(screen.getByText('Unidades: 3')).toBeInTheDocument()
  })

  it('muestra el total con formato de pesos', () => {
    render(<CartSummary total={155970} itemCount={3} />)
    expect(screen.getByText('Total: $155.970')).toBeInTheDocument()
  })

  it('llama a onConfirm al hacer clic en Confirmar pedido', async () => {
    const user = userEvent.setup()
    const fakeConfirm = vi.fn()
    render(<CartSummary total={155970} itemCount={3} onConfirm={fakeConfirm} />)

    await user.click(screen.getByRole('button', { name: 'Confirmar pedido' }))

    expect(fakeConfirm).toHaveBeenCalledTimes(1)
  })
})