import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FormField from './FormField'

describe('FormField', () => {
  it('muestra el label asociado al campo mediante el id', () => {
    render(<FormField id="correo" label="Correo electrónico" />)

    // getByLabelText solo encuentra el campo si label y input quedaron conectados
    const campo = screen.getByLabelText('Correo electrónico')
    expect(campo).toHaveAttribute('id', 'correo')
  })

  it('usa el id también como name del campo', () => {
    render(<FormField id="correo" label="Correo electrónico" />)
    expect(screen.getByLabelText('Correo electrónico')).toHaveAttribute('name', 'correo')
  })

  it('renderiza un input de tipo text por defecto', () => {
    render(<FormField id="nombre" label="Nombre" />)

    const campo = screen.getByLabelText('Nombre')
    expect(campo.tagName).toBe('INPUT')
    expect(campo).toHaveAttribute('type', 'text')
  })

  it('usa el type recibido por props', () => {
    render(<FormField id="correo" label="Correo" type="email" />)
    expect(screen.getByLabelText('Correo')).toHaveAttribute('type', 'email')
  })

  it('renderiza un textarea cuando type es "textarea"', () => {
    render(<FormField id="mensaje" label="Mensaje" type="textarea" />)

    const campo = screen.getByLabelText('Mensaje')
    expect(campo.tagName).toBe('TEXTAREA')
  })

  it('pasa placeholder, value y autoComplete al input', () => {
    render(
      <FormField
        id="nombre"
        label="Nombre"
        placeholder="Pepito Perez"
        value="Pepito"
        autoComplete="username"
        onChange={() => {}}
      />
    )

    const campo = screen.getByLabelText('Nombre')
    expect(campo).toHaveAttribute('placeholder', 'Pepito Perez')
    expect(campo).toHaveValue('Pepito')
    expect(campo).toHaveAttribute('autocomplete', 'username')
  })

  it('pasa placeholder y value al textarea', () => {
    render(
      <FormField
        id="mensaje"
        label="Mensaje"
        type="textarea"
        placeholder="Escribe aquí"
        value="Hola"
        onChange={() => {}}
      />
    )

    const campo = screen.getByLabelText('Mensaje')
    expect(campo).toHaveAttribute('placeholder', 'Escribe aquí')
    expect(campo).toHaveValue('Hola')
  })

  it('no muestra mensaje de error ni clase is-invalid si no hay error', () => {
    render(<FormField id="nombre" label="Nombre" />)

    expect(screen.getByLabelText('Nombre')).not.toHaveClass('is-invalid')
    expect(document.querySelector('.invalid-feedback')).not.toBeInTheDocument()
  })

  it('muestra el mensaje de error y marca el input como inválido', () => {
    render(<FormField id="nombre" label="Nombre" error="El nombre no puede estar vacio" />)

    expect(screen.getByText('El nombre no puede estar vacio')).toBeInTheDocument()
    expect(screen.getByLabelText('Nombre')).toHaveClass('is-invalid')
  })

  it('marca el textarea como inválido cuando hay error', () => {
    render(<FormField id="mensaje" label="Mensaje" type="textarea" error="Mensaje requerido" />)

    expect(screen.getByLabelText('Mensaje')).toHaveClass('is-invalid')
    expect(screen.getByText('Mensaje requerido')).toBeInTheDocument()
  })

  it('marca el input como válido cuando isVerified está activo', () => {
    render(<FormField id="nombre" label="Nombre" isVerified />)
    expect(screen.getByLabelText('Nombre')).toHaveClass('is-valid')
  })

  it('marca el textarea como válido cuando isVerified está activo', () => {
    render(<FormField id="mensaje" label="Mensaje" type="textarea" isVerified />)
    expect(screen.getByLabelText('Mensaje')).toHaveClass('is-valid')
  })

  it('prioriza el error sobre la verificación', () => {
    render(<FormField id="nombre" label="Nombre" error="Error" isVerified />)

    const campo = screen.getByLabelText('Nombre')
    expect(campo).toHaveClass('is-invalid')
    expect(campo).not.toHaveClass('is-valid')
  })

  it('llama a onChange cuando el usuario escribe en el input', async () => {
    const user = userEvent.setup()
    const fakeChange = vi.fn()
    render(<FormField id="nombre" label="Nombre" onChange={fakeChange} />)

    await user.type(screen.getByLabelText('Nombre'), 'abc')

    expect(fakeChange).toHaveBeenCalledTimes(3)
  })

  it('llama a onChange cuando el usuario escribe en el textarea', async () => {
    const user = userEvent.setup()
    const fakeChange = vi.fn()
    render(<FormField id="mensaje" label="Mensaje" type="textarea" onChange={fakeChange} />)

    await user.type(screen.getByLabelText('Mensaje'), 'hola')

    expect(fakeChange).toHaveBeenCalledTimes(4)
  })
})