import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Input from './Input'

describe('Input', () => {
  it('muestra el placeholder, id y name recibidos por props', () => {
    render(<Input id="correo" name="correo" placeholder="ejemplo@gmail.com" />)

    const campo = screen.getByPlaceholderText('ejemplo@gmail.com')
    expect(campo).toHaveAttribute('id', 'correo')
    expect(campo).toHaveAttribute('name', 'correo')
  })

  it('usa type="text" por defecto', () => {
    render(<Input placeholder="Nombre" />)
    expect(screen.getByPlaceholderText('Nombre')).toHaveAttribute('type', 'text')
  })

  it('usa el type recibido por props', () => {
    render(<Input type="email" placeholder="ejemplo@gmail.com" />)
    expect(screen.getByPlaceholderText('ejemplo@gmail.com')).toHaveAttribute('type', 'email')
  })

  it('pasa el autoComplete recibido por props', () => {
    render(<Input placeholder="Nombre" autoComplete="username" />)
    expect(screen.getByPlaceholderText('Nombre')).toHaveAttribute('autocomplete', 'username')
  })

  it('muestra el value recibido por props', () => {
    render(<Input placeholder="Nombre" value="Pepito" onChange={() => {}} />)
    expect(screen.getByPlaceholderText('Nombre')).toHaveValue('Pepito')
  })

  it('solo tiene form-control si no hay error ni verificación', () => {
    render(<Input placeholder="Nombre" />)
    const campo = screen.getByPlaceholderText('Nombre')
    expect(campo).toHaveClass('form-control')
    expect(campo).not.toHaveClass('is-invalid')
    expect(campo).not.toHaveClass('is-valid')
  })

  it('agrega is-invalid cuando hasError está activo', () => {
    render(<Input placeholder="Nombre" hasError />)
    expect(screen.getByPlaceholderText('Nombre')).toHaveClass('is-invalid')
  })

  it('agrega is-valid cuando isVerified está activo', () => {
    render(<Input placeholder="Nombre" isVerified />)
    expect(screen.getByPlaceholderText('Nombre')).toHaveClass('is-valid')
  })

  it('prioriza is-invalid sobre is-valid si ambos están activos', () => {
    render(<Input placeholder="Nombre" hasError isVerified />)
    const campo = screen.getByPlaceholderText('Nombre')
    expect(campo).toHaveClass('is-invalid')
    expect(campo).not.toHaveClass('is-valid')
  })

  it('llama a onChange cuando el usuario escribe', async () => {
    const user = userEvent.setup()
    const fakeChange = vi.fn()
    render(<Input placeholder="Nombre" onChange={fakeChange} />)

    await user.type(screen.getByPlaceholderText('Nombre'), 'abc')

    expect(fakeChange).toHaveBeenCalledTimes(3)
  })
})