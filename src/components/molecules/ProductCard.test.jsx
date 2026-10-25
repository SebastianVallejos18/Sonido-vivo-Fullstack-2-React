import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import ProductCard from './ProductCard'

describe('ProductCard', () => {
  it('muestra nombre, precio, descripción e imagen del producto', () => {
    render(
      <ProductCard
        image="guitarra.jpg"
        alt="Guitarra acústica"
        text="Guitarra acústica"
        price="$150.000"
        description="Ideal para principiantes"
      />
    )

    expect(screen.getByRole('heading', { name: 'Guitarra acústica' })).toBeInTheDocument()
    expect(screen.getByText('$150.000')).toBeInTheDocument()
    expect(screen.getByText('Ideal para principiantes')).toBeInTheDocument()
    expect(screen.getByAltText('Guitarra acústica')).toBeInTheDocument()
  })

  it('no muestra el botón si showButton no está activo', () => {
    render(<ProductCard text="Teclado" price="$200.000" description="Teclado de 61 teclas" />)
    expect(screen.queryByRole('button', { name: 'Agregar al carrito' })).not.toBeInTheDocument()
  })

  it('muestra el botón si showButton está activo, sin el mensaje todavía', () => {
    render(<ProductCard text="Teclado" price="$200.000" description="Teclado de 61 teclas" showButton />)

    expect(screen.getByRole('button', { name: 'Agregar al carrito' })).toBeInTheDocument()
    expect(screen.queryByText('¡Producto agregado!')).not.toBeInTheDocument()
  })

  it('muestra "¡Producto agregado!" al hacer clic en el botón', async () => {
    const user = userEvent.setup()
    render(<ProductCard text="Teclado" price="$200.000" description="Teclado de 61 teclas" showButton />)

    await user.click(screen.getByRole('button', { name: 'Agregar al carrito' }))

    expect(screen.getByText('¡Producto agregado!')).toBeInTheDocument()
  })

  it('llama a onAdd al hacer clic en el botón', async () => {
    const user = userEvent.setup()
    const fakeAdd = vi.fn()
    render(<ProductCard text="Teclado" price="$200.000" description="Teclado de 61 teclas" showButton onAdd={fakeAdd} />)

    await user.click(screen.getByRole('button', { name: 'Agregar al carrito' }))

    expect(fakeAdd).toHaveBeenCalledTimes(1)
  })

  it('muestra el precio anterior tachado y el descuento si es una oferta', () => {
    render(<ProductCard text="Teclado" price="$160.000" oldPrice="$200.000" discount={20} description="Teclado de 61 teclas" />)

    expect(screen.getByText('$160.000')).toBeInTheDocument()
    expect(screen.getByText('$200.000')).toBeInTheDocument()
    expect(screen.getByText('-20%')).toBeInTheDocument()
  })

  it('no muestra descuento si el producto no es una oferta', () => {
    render(<ProductCard text="Teclado" price="$200.000" description="Teclado de 61 teclas" />)
    expect(screen.queryByText(/%/)).not.toBeInTheDocument()
  })

  it('muestra un enlace al detalle cuando recibe detailTo', () => {
    render(
      <MemoryRouter>
        <ProductCard text="Teclado" price="$200.000" description="Teclado de 61 teclas" detailTo="/producto/teclado" />
      </MemoryRouter>
    )

    expect(screen.getByRole('link', { name: 'Ver detalle de Teclado' })).toHaveAttribute('href', '/producto/teclado')
  })

  it('no muestra el enlace si no recibe detailTo', () => {
    render(<ProductCard text="Teclado" price="$200.000" description="Teclado de 61 teclas" />)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })
})