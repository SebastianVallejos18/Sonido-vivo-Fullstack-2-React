import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TextArea from './TextArea'

describe('TextArea', () => {
  it('muestra el placeholder, id y name recibidos por props', () => {
    render(<TextArea id="mensaje" name="mensaje" placeholder="Escribe tu mensaje" />)

    const campo = screen.getByPlaceholderText('Escribe tu mensaje')
    expect(campo).toHaveAttribute('id', 'mensaje')
    expect(campo).toHaveAttribute('name', 'mensaje')
  })

  it('tiene 4 filas', () => {
    render(<TextArea placeholder="Escribe tu mensaje" />)
    expect(screen.getByPlaceholderText('Escribe tu mensaje')).toHaveAttribute('rows', '4')
  })

  it('muestra el value recibido por props', () => {
    render(<TextArea placeholder="Mensaje" value="Hola" onChange={() => {}} />)
    expect(screen.getByPlaceholderText('Mensaje')).toHaveValue('Hola')
  })

  it('solo tiene form-control si no hay error ni verificación', () => {
    render(<TextArea placeholder="Mensaje" />)
    const campo = screen.getByPlaceholderText('Mensaje')
    expect(campo).toHaveClass('form-control')
    expect(campo).not.toHaveClass('is-invalid')
    expect(campo).not.toHaveClass('is-valid')
  })

  it('agrega is-invalid cuando hasError está activo', () => {
    render(<TextArea placeholder="Mensaje" hasError />)
    expect(screen.getByPlaceholderText('Mensaje')).toHaveClass('is-invalid')
  })

  it('agrega is-valid cuando isVerified está activo', () => {
    render(<TextArea placeholder="Mensaje" isVerified />)
    expect(screen.getByPlaceholderText('Mensaje')).toHaveClass('is-valid')
  })

  it('prioriza is-invalid sobre is-valid si ambos están activos', () => {
    render(<TextArea placeholder="Mensaje" hasError isVerified />)
    const campo = screen.getByPlaceholderText('Mensaje')
    expect(campo).toHaveClass('is-invalid')
    expect(campo).not.toHaveClass('is-valid')
  })

  it('llama a onChange cuando el usuario escribe', async () => {
    const user = userEvent.setup()
    const fakeChange = vi.fn()
    render(<TextArea placeholder="Mensaje" onChange={fakeChange} />)

    await user.type(screen.getByPlaceholderText('Mensaje'), 'hola')

    expect(fakeChange).toHaveBeenCalledTimes(4)
  })
})