import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import UserTable from './UserTable'

const users = [
  { id: 1, nombre: 'Dueño Sonido Vivo', correo: 'dueno@sonidovivo.cl', rol: 'Administrador', activo: true },
  { id: 2, nombre: 'Vendedor Uno', correo: 'vendedor1@sonidovivo.cl', rol: 'Vendedor', activo: false },
]

describe('UserTable', () => {
  it('muestra los encabezados de las columnas', () => {
    render(<UserTable users={users} />)

    for (const nombre of ['Nombre', 'Correo', 'Rol', 'Estado', 'Acciones']) {
      expect(screen.getByRole('columnheader', { name: nombre })).toBeInTheDocument()
    }
  })

  it('muestra una fila por usuario más la de encabezados', () => {
    render(<UserTable users={users} />)
    expect(screen.getAllByRole('row')).toHaveLength(3)
  })

  it('muestra el nombre, correo y rol de cada usuario', () => {
    render(<UserTable users={users} />)

    expect(screen.getByText('Dueño Sonido Vivo')).toBeInTheDocument()
    expect(screen.getByText('dueno@sonidovivo.cl')).toBeInTheDocument()
    expect(screen.getByText('Administrador')).toBeInTheDocument()
    expect(screen.getByText('Vendedor')).toBeInTheDocument()
  })

  it('muestra el estado Activo o Inactivo de cada usuario', () => {
    render(<UserTable users={users} />)

    expect(screen.getByText('Activo')).toHaveClass('bg-success')
    expect(screen.getByText('Inactivo')).toHaveClass('bg-secondary')
  })

  it('ofrece Desactivar a los activos y Activar a los inactivos', () => {
    render(<UserTable users={users} />)

    expect(screen.getByRole('button', { name: 'Desactivar a Dueño Sonido Vivo' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Activar a Vendedor Uno' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Activar a Dueño Sonido Vivo' })).not.toBeInTheDocument()
  })

  it('llama a onEdit con el usuario de esa fila', async () => {
    const user = userEvent.setup()
    const fakeEdit = vi.fn()
    render(<UserTable users={users} onEdit={fakeEdit} />)

    await user.click(screen.getByRole('button', { name: 'Editar a Vendedor Uno' }))

    expect(fakeEdit).toHaveBeenCalledWith(users[1])
  })

  it('llama a onToggle con el usuario de esa fila', async () => {
    const user = userEvent.setup()
    const fakeToggle = vi.fn()
    render(<UserTable users={users} onToggle={fakeToggle} />)

    await user.click(screen.getByRole('button', { name: 'Desactivar a Dueño Sonido Vivo' }))

    expect(fakeToggle).toHaveBeenCalledWith(users[0])
  })

  it('envuelve la tabla en un contenedor responsive', () => {
    const { container } = render(<UserTable users={users} />)
    expect(container.querySelector('.table-responsive')).toBeInTheDocument()
  })

  it('muestra un mensaje si no hay usuarios', () => {
    render(<UserTable users={[]} />)

    expect(screen.getByText('No hay usuarios registrados.')).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })
})