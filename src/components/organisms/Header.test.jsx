import { render, screen, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Header from './Header'
import { agregarProducto } from '../../services/carritoService'

function renderHeader(ruta = '/') {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <Header />
    </MemoryRouter>
  )
}

const guitarra = { nombre: 'Guitarra Acústica Folk', imagen: '/guitarra.jpeg', precio: '$129.990' }

describe('Header', () => {
  it('muestra el nombre de la tienda como enlace al inicio', () => {
    renderHeader()
    expect(screen.getByRole('link', { name: 'Sonido Vivo' })).toHaveAttribute('href', '/')
  })

  it('muestra los cuatro enlaces del menú con sus rutas', () => {
    renderHeader()

    expect(screen.getByRole('link', { name: 'Inicio' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Productos' })).toHaveAttribute('href', '/catalogo')
    expect(screen.getByRole('link', { name: 'Contacto' })).toHaveAttribute('href', '/contact')
    expect(screen.getByRole('link', { name: 'Iniciar sesión' })).toHaveAttribute('href', '/login')
  })

  it('marca "Inicio" como activo cuando estás en /', () => {
    renderHeader('/')
    expect(screen.getByRole('link', { name: 'Inicio' })).toHaveClass('active')
    expect(screen.getByRole('link', { name: 'Productos' })).not.toHaveClass('active')
  })

  it('marca "Productos" como activo cuando estás en /catalogo', () => {
    renderHeader('/catalogo')
    expect(screen.getByRole('link', { name: 'Productos' })).toHaveClass('active')
  })

  it('no marca "Inicio" como activo en otras páginas', () => {
    renderHeader('/catalogo')
    expect(screen.getByRole('link', { name: 'Inicio' })).not.toHaveClass('active')
  })

  it('tiene el botón para desplegar el menú en pantallas pequeñas', () => {
    renderHeader()
    expect(screen.getByRole('button', { name: /toggle navigation/i })).toBeInTheDocument()
  })

  it('tiene un enlace a las ofertas', () => {
    renderHeader()
    expect(screen.getByRole('link', { name: 'Ofertas' })).toHaveAttribute('href', '/ofertas')
  })
})

describe('Header (carrito)', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('tiene un enlace al carrito', () => {
    renderHeader()
    expect(screen.getByRole('link', { name: /Carrito/ })).toHaveAttribute('href', '/carrito')
  })

  it('no muestra el contador si el carrito está vacío', () => {
    renderHeader()
    expect(screen.queryByTestId('contador-carrito')).not.toBeInTheDocument()
  })

  it('muestra las unidades que ya estaban guardadas', () => {
    agregarProducto(guitarra)
    agregarProducto(guitarra)
    renderHeader()

    expect(screen.getByTestId('contador-carrito')).toHaveTextContent('2')
  })

  it('actualiza el contador cuando se agrega un producto', () => {
    renderHeader()

    act(() => {
      agregarProducto(guitarra)
    })

    expect(screen.getByTestId('contador-carrito')).toHaveTextContent('1')
  })
})