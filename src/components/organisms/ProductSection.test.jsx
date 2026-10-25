import { render as renderBase, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import ProductSection from './ProductSection'

function render(ui) {
  return renderBase(<MemoryRouter>{ui}</MemoryRouter>)
}

const productos = [
  {
    nombre: 'Guitarra acústica',
    imagen: 'guitarra.jpg',
    precio: '$150.000',
    descripcion: 'Ideal para principiantes',
  },
  {
    nombre: 'Teclado 61 teclas',
    imagen: 'teclado.jpg',
    precio: '$200.000',
    descripcion: 'Con sonidos precargados',
  },
]

describe('ProductSection', () => {
  it('muestra el título de la sección', () => {
    render(<ProductSection id="guitarras" titulo="Guitarras" productos={productos} />)
    expect(screen.getByRole('heading', { level: 2, name: 'Guitarras' })).toBeInTheDocument()
  })

  it('la sección tiene el id recibido por props', () => {
    const { container } = render(<ProductSection id="guitarras" titulo="Guitarras" productos={productos} />)
    expect(container.querySelector('section')).toHaveAttribute('id', 'guitarras')
  })

  it('muestra una tarjeta por cada producto', () => {
    render(<ProductSection id="guitarras" titulo="Guitarras" productos={productos} />)

    // Cada ProductCard tiene un título h3
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(2)
    expect(screen.getByRole('heading', { level: 3, name: 'Guitarra acústica' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Teclado 61 teclas' })).toBeInTheDocument()
  })

  it('pasa precio, descripción e imagen a cada tarjeta', () => {
    render(<ProductSection id="guitarras" titulo="Guitarras" productos={productos} />)

    expect(screen.getByText('$150.000')).toBeInTheDocument()
    expect(screen.getByText('Con sonidos precargados')).toBeInTheDocument()
    expect(screen.getByAltText('Guitarra acústica')).toHaveAttribute('src', 'guitarra.jpg')
  })

  it('cada tarjeta muestra el botón "Agregar al carrito"', () => {
    render(<ProductSection id="guitarras" titulo="Guitarras" productos={productos} />)
    expect(screen.getAllByRole('button', { name: 'Agregar al carrito' })).toHaveLength(2)
  })

  it('al agregar un producto, el aviso aparece solo en esa tarjeta', async () => {
    const user = userEvent.setup()
    render(<ProductSection id="guitarras" titulo="Guitarras" productos={productos} />)

    const botones = screen.getAllByRole('button', { name: 'Agregar al carrito' })
    await user.click(botones[0])

    expect(screen.getAllByText('¡Producto agregado!')).toHaveLength(1)
  })

  it('muestra el título pero ninguna tarjeta si no hay productos', () => {
    render(<ProductSection id="vacia" titulo="Sin productos" productos={[]} />)

    expect(screen.getByRole('heading', { level: 2, name: 'Sin productos' })).toBeInTheDocument()
    expect(screen.queryAllByRole('heading', { level: 3 })).toHaveLength(0)
  })

  it('llama a onAdd con el producto de la tarjeta donde se hizo clic', async () => {
  const user = userEvent.setup()
  const fakeAdd = vi.fn()
  render(<ProductSection id="guitarras" titulo="Guitarras" productos={productos} onAdd={fakeAdd} />)

  const botones = screen.getAllByRole('button', { name: 'Agregar al carrito' })
  await user.click(botones[1])

  expect(fakeAdd).toHaveBeenCalledWith(productos[1])
})
})