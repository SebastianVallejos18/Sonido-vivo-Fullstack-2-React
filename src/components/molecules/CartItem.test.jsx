import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CartItem from './CartItem'

const datos = {
  image: '/guitarra.jpeg',
  text: 'Guitarra Acústica Folk',
  price: '$129.990',
  quantity: 2,
}

// {...datos} copia todas las props del objeto; si después pones otra, esa gana

describe('CartItem', () => {
  it('muestra el nombre del producto como título', () => {
    render(<CartItem {...datos} />)
    expect(screen.getByRole('heading', { level: 3, name: 'Guitarra Acústica Folk' })).toBeInTheDocument()
  })

  it('muestra la imagen del producto', () => {
    render(<CartItem {...datos} />)
    expect(screen.getByAltText('Guitarra Acústica Folk')).toHaveAttribute('src', '/guitarra.jpeg')
  })

  it('muestra el precio unitario', () => {
    render(<CartItem {...datos} />)
    expect(screen.getByText('Precio unitario: $129.990')).toBeInTheDocument()
  })

  it('muestra la cantidad', () => {
    render(<CartItem {...datos} quantity={3} />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('calcula el subtotal como precio por cantidad', () => {
    render(<CartItem {...datos} quantity={2} />)
    expect(screen.getByText('Subtotal: $259.980')).toBeInTheDocument()
  })

  it('llama a onIncrease al aumentar la cantidad', async () => {
    const user = userEvent.setup()
    const fakeIncrease = vi.fn()
    render(<CartItem {...datos} onIncrease={fakeIncrease} />)

    await user.click(screen.getByRole('button', { name: /Aumentar cantidad/ }))

    expect(fakeIncrease).toHaveBeenCalledTimes(1)
  })

  it('llama a onDecrease al disminuir la cantidad', async () => {
    const user = userEvent.setup()
    const fakeDecrease = vi.fn()
    render(<CartItem {...datos} quantity={2} onDecrease={fakeDecrease} />)

    await user.click(screen.getByRole('button', { name: /Disminuir cantidad/ }))

    expect(fakeDecrease).toHaveBeenCalledTimes(1)
  })

  it('llama a onRemove al hacer clic en Quitar', async () => {
    const user = userEvent.setup()
    const fakeRemove = vi.fn()
    render(<CartItem {...datos} onRemove={fakeRemove} />)

    await user.click(screen.getByRole('button', { name: 'Quitar' }))

    expect(fakeRemove).toHaveBeenCalledTimes(1)
  })

  it('deshabilita disminuir cuando la cantidad es 1', async () => {
    const user = userEvent.setup()
    const fakeDecrease = vi.fn()
    render(<CartItem {...datos} quantity={1} onDecrease={fakeDecrease} />)

    const boton = screen.getByRole('button', { name: /Disminuir cantidad/ })
    await user.click(boton)

    expect(boton).toBeDisabled()
    expect(fakeDecrease).not.toHaveBeenCalled()
  })

  it('habilita disminuir cuando la cantidad es mayor a 1', () => {
    render(<CartItem {...datos} quantity={2} />)
    expect(screen.getByRole('button', { name: /Disminuir cantidad/ })).toBeEnabled()
  })
})