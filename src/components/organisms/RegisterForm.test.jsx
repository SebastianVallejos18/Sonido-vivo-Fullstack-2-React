import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import RegisterForm from './RegisterForm'
import { registrarUsuario } from '../../services/authService'

vi.mock('../../services/authService', () => ({
  registrarUsuario: vi.fn(),
  obtenerMensajeError: vi.fn((error) => error.message),
}))

function renderRegister() {
  return render(
    <MemoryRouter>
      <RegisterForm />
    </MemoryRouter>
  )
}

async function completarFormulario(user, password) {
  await user.type(screen.getByLabelText('Nombre de usuario'), 'Juan Perez')
  await user.type(screen.getByLabelText('Correo electrónico'), 'juan@correo.com')
  await user.type(screen.getByLabelText('Contraseña'), password)
  await user.click(screen.getByRole('button', { name: 'Registrar' }))
}

describe('RegisterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('muestra el título, los campos y el botón', () => {
    renderRegister()

    expect(screen.getByRole('heading', { name: 'Registrarse' })).toBeInTheDocument()
    expect(screen.getByLabelText('Nombre de usuario')).toBeInTheDocument()
    expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument()
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Registrar' })).toBeInTheDocument()
  })

  it('el campo de contraseña es de tipo password y ya no pide teléfono', () => {
    renderRegister()
    expect(screen.getByLabelText('Contraseña')).toHaveAttribute('type', 'password')
    expect(screen.queryByLabelText('Número de teléfono')).not.toBeInTheDocument()
  })

  it('tiene un enlace a la página de inicio de sesión', () => {
    renderRegister()
    expect(screen.getByRole('link', { name: /Inicia sesión aquí/ })).toHaveAttribute('href', '/login')
  })

  it('no muestra errores ni avisos antes de enviar', () => {
    renderRegister()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('muestra los tres errores y no llama a la API si se envía vacío', async () => {
    const user = userEvent.setup()
    renderRegister()

    await user.click(screen.getByRole('button', { name: 'Registrar' }))

    expect(screen.getByText('Por favor ingresa tu nombre de usuario.')).toBeInTheDocument()
    expect(screen.getByText(/Ingresa un correo válido/)).toBeInTheDocument()
    expect(screen.getByText(/al menos 8 caracteres/)).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveClass('alert-danger')
    expect(registrarUsuario).not.toHaveBeenCalled()
  })

  it('muestra solo el error del correo si el correo es inválido', async () => {
    const user = userEvent.setup()
    renderRegister()

    await user.type(screen.getByLabelText('Nombre de usuario'), 'Juan Perez')
    await user.type(screen.getByLabelText('Correo electrónico'), 'correo-malo')
    await user.type(screen.getByLabelText('Contraseña'), 'Clave1234')
    await user.click(screen.getByRole('button', { name: 'Registrar' }))

    expect(screen.getByText(/Ingresa un correo válido/)).toBeInTheDocument()
    expect(screen.queryByText(/al menos 8 caracteres/)).not.toBeInTheDocument()
    expect(screen.queryByText('Por favor ingresa tu nombre de usuario.')).not.toBeInTheDocument()
    expect(registrarUsuario).not.toHaveBeenCalled()
  })

  it.each([
    ['abc'],
    ['1234567'],
  ])('rechaza la contraseña corta "%s"', async (password) => {
    const user = userEvent.setup()
    renderRegister()

    await completarFormulario(user, password)

    expect(screen.getByText(/al menos 8 caracteres/)).toBeInTheDocument()
    expect(screen.getByLabelText('Contraseña')).toHaveClass('is-invalid')
    expect(registrarUsuario).not.toHaveBeenCalled()
  })

  it('envía los datos a la API y muestra el éxito si todo está bien', async () => {
    registrarUsuario.mockResolvedValue({ id: 7 })
    const user = userEvent.setup()
    renderRegister()

    await completarFormulario(user, 'Clave1234')

    expect(registrarUsuario).toHaveBeenCalledWith({
      nombre: 'Juan Perez',
      correo: 'juan@correo.com',
      password: 'Clave1234',
    })
    expect(await screen.findByText('¡Cuenta creada! Ya puedes iniciar sesión.')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveClass('alert-success')
    expect(screen.getByLabelText('Nombre de usuario')).toHaveValue('')
  })

  it('muestra el mensaje de error de la API, por ejemplo un correo repetido', async () => {
    registrarUsuario.mockRejectedValue(new Error('El email ya está registrado'))
    const user = userEvent.setup()
    renderRegister()

    await completarFormulario(user, 'Clave1234')

    expect(await screen.findByText('El email ya está registrado')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveClass('alert-danger')
  })

  it('muestra el estado de carga mientras espera la respuesta', async () => {
    registrarUsuario.mockReturnValue(new Promise(() => {}))
    const user = userEvent.setup()
    renderRegister()

    await completarFormulario(user, 'Clave1234')

    expect(await screen.findByRole('button', { name: 'Registrando...' })).toBeInTheDocument()
  })
})