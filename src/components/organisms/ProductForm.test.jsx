import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProductForm from './ProductForm'

const categorias = ['Guitarras Acústicas', 'Bajos Eléctricos']

const producto = {
  id: 3, nombre: 'Bajo Jazz', descripcion: 'Alder', precio: 699990, stock: 4,
  descuento: 0, categoria: 'Bajos Eléctricos', imagen: '/bajo.jpeg',
}

describe('ProductForm', () => {
  it('en modo crear muestra el título y el botón Crear producto', () => {
    render(<ProductForm categorias={categorias} onSubmit={vi.fn()} />)

    expect(screen.getByRole('heading', { name: 'Nuevo producto' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Crear producto' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Cancelar' })).not.toBeInTheDocument()
  })

  it('no envía y muestra errores si faltan datos', async () => {
    const user = userEvent.setup()
    const fakeSubmit = vi.fn()
    render(<ProductForm categorias={categorias} onSubmit={fakeSubmit} />)

    await user.click(screen.getByRole('button', { name: 'Crear producto' }))

    expect(screen.getByText('El nombre debe tener entre 2 y 100 caracteres.')).toBeInTheDocument()
    expect(screen.getByText('Selecciona una categoría.')).toBeInTheDocument()
    expect(fakeSubmit).not.toHaveBeenCalled()
  })

  it('envía los datos cuando todo es válido', async () => {
    const user = userEvent.setup()
    const fakeSubmit = vi.fn()
    render(<ProductForm categorias={categorias} onSubmit={fakeSubmit} />)

    await user.type(screen.getByLabelText('Nombre'), 'Ukelele Soprano')
    await user.selectOptions(screen.getByLabelText('Categoría'), 'Guitarras Acústicas')
    await user.type(screen.getByLabelText('Precio ($)'), '49990')
    await user.type(screen.getByLabelText('Stock'), '5')
    await user.click(screen.getByRole('button', { name: 'Crear producto' }))

    expect(fakeSubmit).toHaveBeenCalledWith({
      nombre: 'Ukelele Soprano', descripcion: '', precio: '49990', stock: '5',
      descuento: '0', categoria: 'Guitarras Acústicas', imagen: '/guitarra.jpeg',
    })
  })

  it('en modo editar viene con los datos del producto y permite cancelar', async () => {
    const user = userEvent.setup()
    const fakeCancel = vi.fn()
    render(<ProductForm producto={producto} categorias={categorias} onSubmit={vi.fn()} onCancel={fakeCancel} />)

    expect(screen.getByRole('heading', { name: 'Editar producto' })).toBeInTheDocument()
    expect(screen.getByLabelText('Nombre')).toHaveValue('Bajo Jazz')
    expect(screen.getByLabelText('Stock')).toHaveValue(4)

    await user.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(fakeCancel).toHaveBeenCalled()
  })
})