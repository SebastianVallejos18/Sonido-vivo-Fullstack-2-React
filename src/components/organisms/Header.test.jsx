import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Header from './Header'

function renderHeader(ruta = '/') {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <Header />
    </MemoryRouter>
  )
}

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
})