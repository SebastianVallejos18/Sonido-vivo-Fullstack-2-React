import { render, screen, fireEvent, createEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProductFilters from './ProductFilters'

const filters = { texto: '', categoria: '', precioMax: '' }
const categories = ['Guitarras', 'Micrófonos']

describe('ProductFilters', () => {
  it('evita que el formulario recargue la página al enviarse', () => {
    render(<ProductFilters filters={filters} categories={categories} />)

    const formulario = screen.getByRole('search')
    const evento = createEvent.submit(formulario)
    fireEvent(formulario, evento)

    expect(evento.defaultPrevented).toBe(true)
  })

  it('muestra los tres campos y el botón para limpiar', () => {
    render(<ProductFilters filters={filters} categories={categories} />)

    expect(screen.getByRole('search')).toBeInTheDocument()
    expect(screen.getByLabelText('Buscar producto')).toBeInTheDocument()
    expect(screen.getByLabelText('Categoría')).toBeInTheDocument()
    expect(screen.getByLabelText('Precio máximo')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Limpiar filtros' })).toBeInTheDocument()
  })

  it('ofrece las categorías recibidas y la opción de ver todas', () => {
    render(<ProductFilters filters={filters} categories={categories} />)

    expect(screen.getByRole('option', { name: 'Todas las categorías' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Guitarras' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Micrófonos' })).toBeInTheDocument()
  })

  it('muestra los valores de los filtros recibidos por props', () => {
    render(
      <ProductFilters
        filters={{ texto: 'bajo', categoria: 'Micrófonos', precioMax: '50000' }}
        categories={categories}
        onChange={() => {}}
      />
    )

    expect(screen.getByLabelText('Buscar producto')).toHaveValue('bajo')
    expect(screen.getByLabelText('Categoría')).toHaveValue('Micrófonos')
    expect(screen.getByLabelText('Precio máximo')).toHaveValue(50000)
  })

  it('llama a onChange con el texto escrito, conservando los otros filtros', async () => {
    const user = userEvent.setup()
    const fakeChange = vi.fn()
    render(<ProductFilters filters={filters} categories={categories} onChange={fakeChange} />)

    await user.type(screen.getByLabelText('Buscar producto'), 'a')

    expect(fakeChange).toHaveBeenCalledWith({ texto: 'a', categoria: '', precioMax: '' })
  })

  it('llama a onChange al elegir una categoría', async () => {
    const user = userEvent.setup()
    const fakeChange = vi.fn()
    render(<ProductFilters filters={filters} categories={categories} onChange={fakeChange} />)

    await user.selectOptions(screen.getByLabelText('Categoría'), 'Micrófonos')

    expect(fakeChange).toHaveBeenCalledWith({ texto: '', categoria: 'Micrófonos', precioMax: '' })
  })

  it('llama a onChange al escribir el precio máximo', async () => {
    const user = userEvent.setup()
    const fakeChange = vi.fn()
    render(<ProductFilters filters={filters} categories={categories} onChange={fakeChange} />)

    await user.type(screen.getByLabelText('Precio máximo'), '5')

    expect(fakeChange).toHaveBeenCalledWith({ texto: '', categoria: '', precioMax: '5' })
  })

  it('llama a onClear al presionar Limpiar filtros', async () => {
    const user = userEvent.setup()
    const fakeClear = vi.fn()
    render(<ProductFilters filters={filters} categories={categories} onClear={fakeClear} />)

    await user.click(screen.getByRole('button', { name: 'Limpiar filtros' }))

    expect(fakeClear).toHaveBeenCalledTimes(1)
  })
})