import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import LoginForm from './LoginForm'

function renderLogin() {
  return render(
    <MemoryRouter>
      <LoginForm />
    </MemoryRouter>
  )
}

describe('LoginForm', () => {
  it('muestra el título, los campos y el botón', () => {
    renderLogin()
    expect(screen.getByRole('heading', { name: 'Inicio de sesión' })).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Pepito Perez')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('ejemplo@gmail.com')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Iniciar sesión' })).toBeInTheDocument()
  })

  it('muestra los errores si se envía el formulario vacío', async () => {
    const user = userEvent.setup()
    renderLogin()

    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

    expect(screen.getByText(/no puede estar vacio/)).toBeInTheDocument()
    expect(screen.getByText(/Ingresa un correo valido/)).toBeInTheDocument()
    expect(screen.getByText('Por favor, corrige los campos marcados en rojo.')).toBeInTheDocument()
  })

  it('muestra solo el error del correo si el correo es inválido', async () => {
    const user = userEvent.setup()
    renderLogin()

    await user.type(screen.getByPlaceholderText('Pepito Perez'), 'Pepito')
    await user.type(screen.getByPlaceholderText('ejemplo@gmail.com'), 'correo-malo')
    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

    expect(screen.queryByText(/no puede estar vacio/)).not.toBeInTheDocument()
    expect(screen.getByText(/Ingresa un correo valido/)).toBeInTheDocument()
  })

  it('muestra el mensaje de éxito si los datos son válidos', async () => {
    const user = userEvent.setup()
    renderLogin()

    await user.type(screen.getByPlaceholderText('Pepito Perez'), 'Pepito')
    await user.type(screen.getByPlaceholderText('ejemplo@gmail.com'), 'pepito@gmail.com')
    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

    expect(screen.getByText('¡Formulario enviado correctamente!')).toBeInTheDocument()
    expect(screen.queryByText(/Ingresa un correo valido/)).not.toBeInTheDocument()
  })

  it('tiene un enlace a la página de registro', () => {
    renderLogin()
    expect(screen.getByRole('link', { name: /Registrate aqui/ })).toHaveAttribute('href', '/register')
  })
})