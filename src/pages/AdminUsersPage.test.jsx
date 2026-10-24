import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import AdminUsersPage from './AdminUsersPage'
import { obtenerUsuarios, obtenerUsuario } from '../services/usuariosService'

function renderPage() {
  return render(
    <MemoryRouter>
      <AdminUsersPage />
    </MemoryRouter>
  )
}

async function llenarFormulario(user, nombre, correo, rol) {
  await user.type(screen.getByLabelText('Nombre'), nombre)
  await user.type(screen.getByLabelText('Correo electrónico'), correo)
  await user.selectOptions(screen.getByLabelText('Rol'), rol)
}

describe('AdminUsersPage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('muestra los usuarios iniciales en la tabla', () => {
    renderPage()

    expect(screen.getByRole('heading', { name: 'Panel de administración' })).toBeInTheDocument()
    // 4 usuarios + la fila de encabezados
    expect(screen.getAllByRole('row')).toHaveLength(5)
  })

  it('crea un usuario, lo muestra en la tabla y limpia el formulario', async () => {
    const user = userEvent.setup()
    renderPage()

    await llenarFormulario(user, 'Camila Rojas', 'camila@correo.com', 'Cliente')
    await user.click(screen.getByRole('button', { name: 'Crear usuario' }))

    expect(screen.getByRole('status')).toHaveTextContent('Usuario creado correctamente.')
    expect(screen.getByText('Camila Rojas')).toBeInTheDocument()
    expect(screen.getAllByRole('row')).toHaveLength(6)
    expect(obtenerUsuarios()).toHaveLength(5)
    expect(screen.getByLabelText('Nombre')).toHaveValue('')
  })

  it('muestra el error del servicio si el correo ya existe', async () => {
    const user = userEvent.setup()
    renderPage()

    await llenarFormulario(user, 'Otra Persona', 'dueno@sonidovivo.cl', 'Cliente')
    await user.click(screen.getByRole('button', { name: 'Crear usuario' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Ya existe un usuario con ese correo')
    expect(screen.getAllByRole('row')).toHaveLength(5)
  })

  it('carga el usuario en el formulario al presionar Editar y guarda los cambios', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('button', { name: 'Editar a Vendedor Uno' }))

    expect(screen.getByRole('heading', { name: 'Editar usuario' })).toBeInTheDocument()
    expect(screen.getByLabelText('Nombre')).toHaveValue('Vendedor Uno')

    const campoNombre = screen.getByLabelText('Nombre')
    await user.clear(campoNombre)
    await user.type(campoNombre, 'Vendedor Principal')
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    expect(screen.getByRole('status')).toHaveTextContent('Usuario actualizado correctamente.')
    expect(screen.getByText('Vendedor Principal')).toBeInTheDocument()
    expect(obtenerUsuario(2).nombre).toBe('Vendedor Principal')
    expect(screen.getByRole('heading', { name: 'Nuevo usuario' })).toBeInTheDocument()
  })

  it('vuelve al modo crear al cancelar la edición', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('button', { name: 'Editar a Vendedor Uno' }))
    await user.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(screen.getByRole('heading', { name: 'Nuevo usuario' })).toBeInTheDocument()
    expect(screen.getByLabelText('Nombre')).toHaveValue('')
  })

  it('desactiva y vuelve a activar un usuario', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('button', { name: 'Desactivar a Vendedor Uno' }))

    expect(screen.getByText('Inactivo')).toBeInTheDocument()
    expect(obtenerUsuario(2).activo).toBe(false)

    await user.click(screen.getByRole('button', { name: 'Activar a Vendedor Uno' }))

    expect(screen.queryByText('Inactivo')).not.toBeInTheDocument()
    expect(obtenerUsuario(2).activo).toBe(true)
  })

  it('no deja desactivar al último administrador y muestra el error', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('button', { name: 'Desactivar a Dueño Sonido Vivo' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Debe quedar al menos un administrador activo')
    expect(obtenerUsuario(1).activo).toBe(true)
  })
})