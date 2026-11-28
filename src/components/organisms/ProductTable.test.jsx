import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProductTable from './ProductTable'

const productos = [
  { id: 1, nombre: 'Guitarra Folk', categoria: 'Guitarras', precio: 129990, stock: 10, descuento: 20 },
  { id: 2, nombre: 'Pedal Delay', categoria: 'Pedales', precio: 179990, stock: 0, descuento: 0 },
]

describe('ProductTable', () => {
  it('avisa cuando no hay productos', () => {
    render(<ProductTable productos={[]} onEdit={vi.fn()} />)
    expect(screen.getByText('No hay productos registrados.')).toBeInTheDocument()
  })

  it('muestra precio, stock y descuento de cada producto', () => {
    render(<ProductTable productos={productos} onEdit={vi.fn()} />)

    expect(screen.getByText('$129.990')).toBeInTheDocument()
    expect(screen.getByText('20%')).toBeInTheDocument()
    expect(screen.getByText('0')).toHaveClass('bg-danger') // agotado en rojo
  })

  it('sin onDelete (vendedor) no muestra el botón Desactivar', () => {
    render(<ProductTable productos={productos} onEdit={vi.fn()} />)
    expect(screen.queryByRole('button', { name: /Desactivar/ })).not.toBeInTheDocument()
  })

  it('llama a onEdit y onDelete con el producto', async () => {
    const user = userEvent.setup()
    const fakeEdit = vi.fn()
    const fakeDelete = vi.fn()
    render(<ProductTable productos={productos} onEdit={fakeEdit} onDelete={fakeDelete} />)

    await user.click(screen.getByRole('button', { name: 'Editar Guitarra Folk' }))
    await user.click(screen.getByRole('button', { name: 'Desactivar Pedal Delay' }))

    expect(fakeEdit).toHaveBeenCalledWith(productos[0])
    expect(fakeDelete).toHaveBeenCalledWith(productos[1])
  })
})