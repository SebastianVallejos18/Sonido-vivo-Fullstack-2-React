import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import ProductDetail from './ProductDetail'

const producto = {
  nombre: 'Guitarra Acústica Folk',
  imagen: '/guitarra.jpeg',
  precio: '$129.990',
  descripcion: 'Tapa de abeto.',
  categoria: 'Guitarras Acústicas',
}

const productoEnOferta = {
  ...producto,
  precio: '$103.992',
  precioOriginal: '$129.990',
  descuento: 20,
}

function renderDetail(datos, onAdd) {
  return render(
    <MemoryRouter>
      <ProductDetail product={datos} onAdd={onAdd} />
    </MemoryRouter>
  )
}

describe('ProductDetail', () => {
  it('muestra el nombre del producto como título', () => {
    renderDetail(producto)
    expect(screen.getByRole('heading', { level: 2, name: 'Guitarra Acústica Folk' })).toBeInTheDocument()
  })

  it('muestra la categoría, el precio y la descripción', () => {
    renderDetail(producto)

    expect(screen.getByText('Guitarras Acústicas')).toBeInTheDocument()
    expect(screen.getByText('$129.990')).toBeInTheDocument()
    expect(screen.getByText('Tapa de abeto.')).toBeInTheDocument()
  })

  it('muestra la imagen del producto', () => {
    renderDetail(producto)
    expect(screen.getByAltText('Guitarra Acústica Folk')).toHaveAttribute('src', '/guitarra.jpeg')
  })

  it('tiene un enlace para volver al catálogo', () => {
    renderDetail(producto)
    expect(screen.getByRole('link', { name: 'Volver al catálogo' })).toHaveAttribute('href', '/catalogo')
  })

  it('no muestra descuento si el producto no es una oferta', () => {
    renderDetail(producto)
    expect(screen.queryByText(/%/)).not.toBeInTheDocument()
  })

  it('muestra el precio anterior y el descuento si es una oferta', () => {
    renderDetail(productoEnOferta)

    expect(screen.getByText('$103.992')).toBeInTheDocument()
    expect(screen.getByText('$129.990')).toBeInTheDocument()
    expect(screen.getByText('-20%')).toBeInTheDocument()
  })

  it('no muestra el aviso de agregado antes de presionar el botón', () => {
    renderDetail(producto)
    expect(screen.queryByText('¡Producto agregado!')).not.toBeInTheDocument()
  })

  it('llama a onAdd y muestra el aviso al agregar al carrito', async () => {
    const user = userEvent.setup()
    const fakeAdd = vi.fn()
    renderDetail(producto, fakeAdd)

    await user.click(screen.getByRole('button', { name: 'Agregar al carrito' }))

    expect(fakeAdd).toHaveBeenCalledTimes(1)
    expect(screen.getByText('¡Producto agregado!')).toBeInTheDocument()
  })

  it('muestra el aviso aunque no reciba onAdd', async () => {
    const user = userEvent.setup()
    renderDetail(producto)

    await user.click(screen.getByRole('button', { name: 'Agregar al carrito' }))

    expect(screen.getByText('¡Producto agregado!')).toBeInTheDocument()
  })
})