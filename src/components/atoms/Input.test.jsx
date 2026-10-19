import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Input from './Input'

describe('Input', () => {
  it('muestra el placeholder y el id recibidos por props', () => {
    render(<Input id="correo" placeholder="ejemplo@gmail.com" />)

    const campo = screen.getByPlaceholderText('ejemplo@gmail.com')
    expect(campo).toHaveAttribute('id', 'correo')
  })

  it('usa el type recibido por props', () => {
    render(<Input type="email" placeholder="ejemplo@gmail.com" />)
    expect(screen.getByPlaceholderText('ejemplo@gmail.com')).toHaveAttribute('type', 'email')
  })

  it('llama a onChange cuando el usuario escribe', async () => {
    const user = userEvent.setup()
    const fakeChange = vi.fn()
    render(<Input placeholder="Nombre" onChange={fakeChange} />)

    await user.type(screen.getByPlaceholderText('Nombre'), 'abc')

    expect(fakeChange).toHaveBeenCalledTimes(3)
  })
})