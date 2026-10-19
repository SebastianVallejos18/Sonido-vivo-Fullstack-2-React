import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import RegisterForm from './RegisterForm'

function renderRegister() {
  return render(
    <MemoryRouter>
      <RegisterForm />
    </MemoryRouter>
  )
}

async function completarFormulario(user, telefono) {
  await user.type(screen.getByLabelText('Nombre de usuario'), 'Juan Perez')
  await user.type(screen.getByLabelText('Correo electrónico'), 'juan@correo.com')
  await user.type(screen.getByLabelText('Número de teléfono'), telefono)
  await user.click(screen.getByRole('button', { name: 'Registrar' }))
}

describe('RegisterForm', () => {
  it('muestra el título, los campos y el botón', () => {
    renderRegister()

    expect(screen.getByRole('heading', { name: 'Registrarse' })).toBeInTheDocument()
    expect(screen.getByLabelText('Nombre de usuario')).toBeInTheDocument()
    expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument()
    expect(screen.getByLabelText('Número de teléfono')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Registrar' })).toBeInTheDocument()
  })

  it('el campo de teléfono es de tipo tel', () => {
    renderRegister()
    expect(screen.getByLabelText('Número de teléfono')).toHaveAttribute('type', 'tel')
  })

  it('tiene un enlace a la página de inicio de sesión', () => {
    renderRegister()
    expect(screen.getByRole('link', { name: /Inicia sesión aquí/ })).toHaveAttribute('href', '/login')
  })

  it('no muestra errores ni avisos antes de enviar', () => {
    renderRegister()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('muestra los tres errores y el aviso si se envía vacío', async () => {
    const user = userEvent.setup()
    renderRegister()

    await user.click(screen.getByRole('button', { name: 'Registrar' }))

    expect(screen.getByText('Por favor ingresa tu nombre de usuario.')).toBeInTheDocument()
    expect(screen.getByText(/Ingresa un correo válido/)).toBeInTheDocument()
    expect(screen.getByText(/Ingresa un número chileno válido/)).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveClass('alert-danger')
  })

  it('muestra solo el error del correo si el correo es inválido', async () => {
    const user = userEvent.setup()
    renderRegister()

    await user.type(screen.getByLabelText('Nombre de usuario'), 'Juan Perez')
    await user.type(screen.getByLabelText('Correo electrónico'), 'correo-malo')
    await user.type(screen.getByLabelText('Número de teléfono'), '+56912345678')
    await user.click(screen.getByRole('button', { name: 'Registrar' }))

    expect(screen.getByText(/Ingresa un correo válido/)).toBeInTheDocument()
    expect(screen.queryByText(/Ingresa un número chileno válido/)).not.toBeInTheDocument()
    expect(screen.queryByText('Por favor ingresa tu nombre de usuario.')).not.toBeInTheDocument()
  })

  it.each([
    ['12345'],
    ['812345678'],
    ['abcdefghi'],
    ['+5691234567'],
  ])('rechaza el teléfono inválido "%s"', async (telefono) => {
    const user = userEvent.setup()
    renderRegister()

    await completarFormulario(user, telefono)

    expect(screen.getByText(/Ingresa un número chileno válido/)).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveClass('alert-danger')
  })

  it.each([
    ['+56912345678'],
    ['912345678'],
    ['56912345678'],
    ['+56 9 1234 5678'],
  ])('acepta el teléfono válido "%s"', async (telefono) => {
    const user = userEvent.setup()
    renderRegister()

    await completarFormulario(user, telefono)

    expect(screen.queryByText(/Ingresa un número chileno válido/)).not.toBeInTheDocument()
    expect(screen.getByText('¡Formulario enviado correctamente!')).toBeInTheDocument()
  })

  it('muestra el aviso de éxito y marca los campos como válidos si todo está bien', async () => {
    const user = userEvent.setup()
    renderRegister()

    await completarFormulario(user, '+56912345678')

    expect(screen.getByRole('alert')).toHaveClass('alert-success')
    expect(screen.getByLabelText('Nombre de usuario')).toHaveClass('is-valid')
    expect(screen.getByLabelText('Correo electrónico')).toHaveClass('is-valid')
    expect(screen.getByLabelText('Número de teléfono')).toHaveClass('is-valid')
  })

  it('marca como inválido solo el campo con error', async () => {
    const user = userEvent.setup()
    renderRegister()

    await completarFormulario(user, '12345')

    expect(screen.getByLabelText('Número de teléfono')).toHaveClass('is-invalid')
    expect(screen.getByLabelText('Nombre de usuario')).toHaveClass('is-valid')
    expect(screen.getByLabelText('Correo electrónico')).toHaveClass('is-valid')
  })
})