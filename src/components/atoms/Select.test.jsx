import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Select from './Select'

const roles = ['Administrador', 'Vendedor', 'Cliente']

describe('Select', () => {
  it('muestra el placeholder y una opción por cada elemento de la lista', () => {
    render(<Select placeholder="Selecciona un rol" options={roles} />)

    expect(screen.getAllByRole('option')).toHaveLength(4)
    expect(screen.getByRole('option', { name: 'Selecciona un rol' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Vendedor' })).toBeInTheDocument()
  })

  it('usa un placeholder por defecto si no recibe uno', () => {
    render(<Select options={roles} />)
    expect(screen.getByRole('option', { name: 'Selecciona una opción' })).toBeInTheDocument()
  })

  it('pasa el id y el name recibidos por props', () => {
    render(<Select id="rol" name="rol" options={roles} />)

    const campo = screen.getByRole('combobox')
    expect(campo).toHaveAttribute('id', 'rol')
    expect(campo).toHaveAttribute('name', 'rol')
  })

  it('muestra el value recibido por props', () => {
    render(<Select options={roles} value="Vendedor" onChange={() => {}} />)
    expect(screen.getByRole('combobox')).toHaveValue('Vendedor')
  })

  it('llama a onChange cuando el usuario elige una opción', async () => {
    const user = userEvent.setup()
    const fakeChange = vi.fn()
    render(<Select options={roles} onChange={fakeChange} />)

    await user.selectOptions(screen.getByRole('combobox'), 'Cliente')

    expect(fakeChange).toHaveBeenCalledTimes(1)
  })

  it('solo tiene form-select si no hay error ni verificación', () => {
    render(<Select options={roles} />)

    const campo = screen.getByRole('combobox')
    expect(campo).toHaveClass('form-select')
    expect(campo).not.toHaveClass('is-invalid')
    expect(campo).not.toHaveClass('is-valid')
  })

  it('agrega is-invalid con hasError y prioriza ese error sobre is-valid', () => {
    render(<Select options={roles} hasError isVerified />)

    const campo = screen.getByRole('combobox')
    expect(campo).toHaveClass('is-invalid')
    expect(campo).not.toHaveClass('is-valid')
  })

  it('agrega is-valid cuando isVerified está activo', () => {
    render(<Select options={roles} isVerified />)
    expect(screen.getByRole('combobox')).toHaveClass('is-valid')
  })
})