import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TextArea from './TextArea'

describe('TextArea', () => {
  it('muestra el placeholder recibido por props', () => {
    render(<TextArea id="mensaje" placeholder="Escribe tu mensaje" />)
    expect(screen.getByPlaceholderText('Escribe tu mensaje')).toBeInTheDocument()
  })

  it('llama a onChange cuando el usuario escribe', async () => {
    const user = userEvent.setup()
    const fakeChange = vi.fn()
    render(<TextArea placeholder="Escribe tu mensaje" onChange={fakeChange} />)

    await user.type(screen.getByPlaceholderText('Escribe tu mensaje'), 'hola')

    expect(fakeChange).toHaveBeenCalledTimes(4)
  })
})