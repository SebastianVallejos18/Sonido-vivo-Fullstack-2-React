import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import AdminUsersPage from './AdminUsersPage'
import {
  obtenerUsuarios,
  crearUsuario,
  actualizarUsuario,
  desactivarUsuario,
  activarUsuario,
} from '../services/usuariosService'

// La página se prueba sin API: el servicio se reemplaza por funciones falsas
vi.mock('../services/usuariosService', () => ({
  obtenerUsuarios: vi.fn(),
  crearUsuario: vi.fn(),
  actualizarUsuario: vi.fn(),
  desactivarUsuario: vi.fn(),
  activarUsuario: vi.fn(),
}))

const usuarios = [
  { id: 1, nombre: 'Dueño Sonido Vivo', correo: 'dueno@sonidovivo.cl', rol: 'Administrador', activo: true },
  { id: 2, nombre: 'Vendedor Uno', correo: 'vendedor1@sonidovivo.cl', rol: 'Vendedor', activo: true },
]

function errorApi(status, mensaje) {
  return { response: { status, data: { error: mensaje } } }
}

function renderPage() {
  return render(
    <MemoryRouter>
      <AdminUsersPage />
    </MemoryRouter>
  )
}

describe('AdminUsersPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    obtenerUsuarios.mockResolvedValue(usuarios)
  })

  it('carga los usuarios desde la API y los muestra en la tabla', async () => {
    renderPage()

    expect(screen.getByText('Cargando usuarios...')).toBeInTheDocument()
    expect(await screen.findByText('Vendedor Uno')).toBeInTheDocument()
    // 2 usuarios + la fila de encabezados
    expect(screen.getAllByRole('row')).toHaveLength(3)
  })

  it('muestra un error si la API no responde', async () => {
    obtenerUsuarios.mockRejectedValue({ code: 'ERR_NETWORK' })
    renderPage()

    expect(await screen.findByRole('alert')).toHaveTextContent('No fue posible contactar la API')
  })

  it('crea un usuario con contraseña y recarga la lista', async () => {
    const user = userEvent.setup()
    crearUsuario.mockResolvedValue({})
    renderPage()
    await screen.findByText('Vendedor Uno')

    await user.type(screen.getByLabelText('Nombre'), 'Camila Rojas')
    await user.type(screen.getByLabelText('Correo electrónico'), 'camila@correo.com')
    await user.type(screen.getByLabelText('Contraseña'), 'clave1234')
    await user.selectOptions(screen.getByLabelText('Rol'), 'Cliente')
    await user.click(screen.getByRole('button', { name: 'Crear usuario' }))

    expect(crearUsuario).toHaveBeenCalledWith({
      nombre: 'Camila Rojas',
      correo: 'camila@correo.com',
      rol: 'Cliente',
      password: 'clave1234',
    })
    expect(await screen.findByRole('status')).toHaveTextContent('Usuario creado correctamente.')
    expect(obtenerUsuarios).toHaveBeenCalledTimes(2)
    expect(screen.getByLabelText('Nombre')).toHaveValue('')
  })

  it('muestra el error de la API si el correo ya existe', async () => {
    const user = userEvent.setup()
    crearUsuario.mockRejectedValue(errorApi(409, 'El email ya está registrado'))
    renderPage()
    await screen.findByText('Vendedor Uno')

    await user.type(screen.getByLabelText('Nombre'), 'Otra Persona')
    await user.type(screen.getByLabelText('Correo electrónico'), 'dueno@sonidovivo.cl')
    await user.type(screen.getByLabelText('Contraseña'), 'clave1234')
    await user.selectOptions(screen.getByLabelText('Rol'), 'Cliente')
    await user.click(screen.getByRole('button', { name: 'Crear usuario' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('El email ya está registrado')
  })

  it('edita un usuario (sin pedir contraseña) y guarda los cambios', async () => {
    const user = userEvent.setup()
    actualizarUsuario.mockResolvedValue({})
    renderPage()

    await user.click(await screen.findByRole('button', { name: 'Editar a Vendedor Uno' }))

    expect(screen.getByRole('heading', { name: 'Editar usuario' })).toBeInTheDocument()
    expect(screen.queryByLabelText('Contraseña')).not.toBeInTheDocument()

    const campoNombre = screen.getByLabelText('Nombre')
    await user.clear(campoNombre)
    await user.type(campoNombre, 'Vendedor Principal')
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    expect(actualizarUsuario).toHaveBeenCalledWith(2, {
      nombre: 'Vendedor Principal',
      correo: 'vendedor1@sonidovivo.cl',
      rol: 'Vendedor',
    })
    expect(await screen.findByRole('status')).toHaveTextContent('Usuario actualizado correctamente.')
    expect(screen.getByRole('heading', { name: 'Nuevo usuario' })).toBeInTheDocument()
  })

  it('vuelve al modo crear al cancelar la edición', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(await screen.findByRole('button', { name: 'Editar a Vendedor Uno' }))
    await user.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(screen.getByRole('heading', { name: 'Nuevo usuario' })).toBeInTheDocument()
    expect(screen.getByLabelText('Nombre')).toHaveValue('')
  })

  it('desactiva un usuario activo', async () => {
    const user = userEvent.setup()
    desactivarUsuario.mockResolvedValue({})
    renderPage()

    await user.click(await screen.findByRole('button', { name: 'Desactivar a Vendedor Uno' }))

    expect(desactivarUsuario).toHaveBeenCalledWith(2)
    expect(await screen.findByRole('status')).toHaveTextContent('Usuario desactivado.')
  })

  it('activa un usuario inactivo', async () => {
    const user = userEvent.setup()
    obtenerUsuarios.mockResolvedValue([usuarios[0], { ...usuarios[1], activo: false }])
    activarUsuario.mockResolvedValue({})
    renderPage()

    await user.click(await screen.findByRole('button', { name: 'Activar a Vendedor Uno' }))

    expect(activarUsuario).toHaveBeenCalledWith(2)
    expect(await screen.findByRole('status')).toHaveTextContent('Usuario activado.')
  })

  it('muestra el error del backend al intentar desactivar al último administrador', async () => {
    const user = userEvent.setup()
    desactivarUsuario.mockRejectedValue(errorApi(409, 'Debe quedar al menos un administrador activo'))
    renderPage()

    await user.click(await screen.findByRole('button', { name: 'Desactivar a Dueño Sonido Vivo' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Debe quedar al menos un administrador activo')
  })
})