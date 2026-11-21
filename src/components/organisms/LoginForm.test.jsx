import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import LoginForm from './LoginForm'
import { iniciarSesion } from '../../services/authService'

vi.mock('../../services/authService', () => ({
  iniciarSesion: vi.fn(),
  obtenerMensajeError: vi.fn((error) => error.message),
}))

function renderLogin() {
  return render(
    <MemoryRouter>
      <LoginForm />
    </MemoryRouter>
  )
}

async function completarFormulario(user) {
  await user.type(screen.getByLabelText('Correo electrónico'), 'pepito@gmail.com')
  await user.type(screen.getByLabelText('Contraseña'), 'Clave1234')
  await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }))
}

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('muestra el título, los campos y el botón', () => {
    renderLogin()
    expect(screen.getByRole('heading', { name: 'Inicio de sesión' })).toBeInTheDocument()
    expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument()
    expect(screen.getByLabelText('Contraseña')).toHaveAttribute('type', 'password')
    expect(screen.getByRole('button', { name: 'Iniciar sesión' })).toBeInTheDocument()
  })

  it('tiene un enlace a la página de registro', () => {
    renderLogin()
    expect(screen.getByRole('link', { name: /Registrate aqui/ })).toHaveAttribute('href', '/register')
  })

  it('muestra los errores y no llama a la API si se envía vacío', async () => {
    const user = userEvent.setup()
    renderLogin()

    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

    expect(screen.getByText(/Ingresa un correo valido/)).toBeInTheDocument()
    expect(screen.getByText(/La contraseña no puede estar vacia/)).toBeInTheDocument()
    expect(screen.getByText('Por favor, corrige los campos marcados en rojo.')).toBeInTheDocument()
    expect(iniciarSesion).not.toHaveBeenCalled()
  })

  it('muestra solo el error del correo si el correo es inválido', async () => {
    const user = userEvent.setup()
    renderLogin()

    await user.type(screen.getByLabelText('Correo electrónico'), 'correo-malo')
    await user.type(screen.getByLabelText('Contraseña'), 'Clave1234')
    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

    expect(screen.getByText(/Ingresa un correo valido/)).toBeInTheDocument()
    expect(screen.queryByText(/La contraseña no puede estar vacia/)).not.toBeInTheDocument()
    expect(iniciarSesion).not.toHaveBeenCalled()
  })

  it('llama a la API con el correo y la contraseña y muestra la bienvenida', async () => {
    iniciarSesion.mockResolvedValue({ token: 't', usuario: { nombre: 'Pepito' } })
    const user = userEvent.setup()
    renderLogin()

    await completarFormulario(user)

    expect(iniciarSesion).toHaveBeenCalledWith({ correo: 'pepito@gmail.com', password: 'Clave1234' })
    expect(await screen.findByText('¡Bienvenido, Pepito!')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveClass('alert-success')
  })

  it('muestra el mensaje de error que devuelve la API', async () => {
    iniciarSesion.mockRejectedValue(new Error('Credenciales inválidas'))
    const user = userEvent.setup()
    renderLogin()

    await completarFormulario(user)

    expect(await screen.findByText('Credenciales inválidas')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveClass('alert-danger')
  })

  it('muestra el estado de carga mientras espera la respuesta', async () => {
    iniciarSesion.mockReturnValue(new Promise(() => {}))
    const user = userEvent.setup()
    renderLogin()

    await completarFormulario(user)

    expect(await screen.findByRole('button', { name: 'Ingresando...' })).toBeInTheDocument()
  })
})