import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import UserForm from './UserForm'

const usuarioExistente = {
  id: 4,
  nombre: 'Cliente de Prueba',
  correo: 'cliente@correo.com',
  rol: 'Cliente',
  activo: true,
}

describe('UserForm', () => {
  describe('modo crear', () => {
    it('muestra el formulario vacío con el título y botón de creación', () => {
      render(<UserForm />)

      expect(screen.getByRole('heading', { name: 'Nuevo usuario' })).toBeInTheDocument()
      expect(screen.getByLabelText('Nombre')).toHaveValue('')
      expect(screen.getByLabelText('Correo electrónico')).toHaveValue('')
      expect(screen.getByLabelText('Rol')).toHaveValue('')
      expect(screen.getByRole('button', { name: 'Crear usuario' })).toBeInTheDocument()
    })

    it('no muestra el botón Cancelar', () => {
      render(<UserForm />)
      expect(screen.queryByRole('button', { name: 'Cancelar' })).not.toBeInTheDocument()
    })

    it('ofrece los tres roles del sistema más el placeholder', () => {
      render(<UserForm />)
      expect(screen.getAllByRole('option')).toHaveLength(4)
    })

    it('muestra los errores y no envía si el formulario está vacío', async () => {
      const user = userEvent.setup()
      const fakeSubmit = vi.fn()
      render(<UserForm onSubmit={fakeSubmit} />)

      await user.click(screen.getByRole('button', { name: 'Crear usuario' }))

      expect(screen.getByText('Por favor ingresa el nombre.')).toBeInTheDocument()
      expect(screen.getByText(/Ingresa un correo válido/)).toBeInTheDocument()
      expect(screen.getByText('Selecciona un rol válido.')).toBeInTheDocument()
      expect(fakeSubmit).not.toHaveBeenCalled()
    })

    it('envía los datos cuando todo es válido', async () => {
      const user = userEvent.setup()
      const fakeSubmit = vi.fn()
      render(<UserForm onSubmit={fakeSubmit} />)

      await user.type(screen.getByLabelText('Nombre'), 'Camila Rojas')
      await user.type(screen.getByLabelText('Correo electrónico'), 'camila@correo.com')
      await user.selectOptions(screen.getByLabelText('Rol'), 'Vendedor')
      await user.click(screen.getByRole('button', { name: 'Crear usuario' }))

      expect(fakeSubmit).toHaveBeenCalledTimes(1)
      expect(fakeSubmit).toHaveBeenCalledWith({
        nombre: 'Camila Rojas',
        correo: 'camila@correo.com',
        rol: 'Vendedor',
      })
    })
  })

  describe('modo editar', () => {
    it('muestra los datos del usuario y los botones de edición', () => {
      render(<UserForm user={usuarioExistente} />)

      expect(screen.getByRole('heading', { name: 'Editar usuario' })).toBeInTheDocument()
      expect(screen.getByLabelText('Nombre')).toHaveValue('Cliente de Prueba')
      expect(screen.getByLabelText('Correo electrónico')).toHaveValue('cliente@correo.com')
      expect(screen.getByLabelText('Rol')).toHaveValue('Cliente')
      expect(screen.getByRole('button', { name: 'Guardar cambios' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument()
    })

    it('envía los datos modificados', async () => {
      const user = userEvent.setup()
      const fakeSubmit = vi.fn()
      render(<UserForm user={usuarioExistente} onSubmit={fakeSubmit} />)

      const campoNombre = screen.getByLabelText('Nombre')
      await user.clear(campoNombre)
      await user.type(campoNombre, 'Cliente Frecuente')
      await user.click(screen.getByRole('button', { name: 'Guardar cambios' }))

      expect(fakeSubmit).toHaveBeenCalledWith({
        nombre: 'Cliente Frecuente',
        correo: 'cliente@correo.com',
        rol: 'Cliente',
      })
    })

    it('llama a onCancel al presionar Cancelar', async () => {
      const user = userEvent.setup()
      const fakeCancel = vi.fn()
      render(<UserForm user={usuarioExistente} onCancel={fakeCancel} />)

      await user.click(screen.getByRole('button', { name: 'Cancelar' }))

      expect(fakeCancel).toHaveBeenCalledTimes(1)
    })
  })
})