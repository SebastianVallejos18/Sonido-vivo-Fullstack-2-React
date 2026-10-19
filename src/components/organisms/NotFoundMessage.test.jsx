import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import NotFoundMessage from './NotFoundMessage'

function renderNotFound() {
  return render(
    <MemoryRouter>
      <NotFoundMessage />
    </MemoryRouter>
  )
}

describe('NotFoundMessage', () => {
  it('muestra el código 404 y el título del error', () => {
    renderNotFound()
    expect(screen.getByRole('heading', { level: 1, name: '404' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Página no encontrada' })).toBeInTheDocument()
  })

  it('explica que la dirección no existe', () => {
    renderNotFound()
    expect(screen.getByText(/no existe o fue movida/)).toBeInTheDocument()
  })

  it('tiene un enlace para volver al inicio', () => {
    renderNotFound()
    const enlace = screen.getByRole('link', { name: 'Volver al inicio' })
    expect(enlace).toHaveAttribute('href', '/')
    expect(enlace).toHaveClass('btn', 'btn-primary')
  })

  it('tiene un enlace para ver los productos', () => {
    renderNotFound()
    const enlace = screen.getByRole('link', { name: 'Ver productos' })
    expect(enlace).toHaveAttribute('href', '/catalogo')
    expect(enlace).toHaveClass('btn', 'btn-outline-secondary')
  })
})