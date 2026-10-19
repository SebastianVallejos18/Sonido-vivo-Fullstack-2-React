import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AuthTemplate from './AuthTemplate'

function renderTemplate() {
  return render(
    <MemoryRouter>
      <AuthTemplate content={<p>Contenido de prueba</p>} />
    </MemoryRouter>
  )
}

describe('AuthTemplate', () => {
  it('muestra el Header con el nombre de la tienda', () => {
    renderTemplate()
    expect(screen.getByRole('link', { name: 'Sonido Vivo' })).toBeInTheDocument()
  })

  it('muestra el Footer', () => {
    renderTemplate()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    expect(screen.getByText(/© 2026 Sonido Vivo/)).toBeInTheDocument()
  })

  it('muestra el contenido recibido por props', () => {
    renderTemplate()
    expect(screen.getByText('Contenido de prueba')).toBeInTheDocument()
  })

  it('pone el contenido dentro del main', () => {
    renderTemplate()
    const principal = screen.getByRole('main')
    expect(within(principal).getByText('Contenido de prueba')).toBeInTheDocument()
  })

  it('el main centra el contenido', () => {
    renderTemplate()
    expect(screen.getByRole('main')).toHaveClass('d-flex', 'align-items-center', 'justify-content-center')
  })

  it('no muestra el Header ni el Footer dentro del main', () => {
    renderTemplate()
    const principal = screen.getByRole('main')
    expect(within(principal).queryByRole('contentinfo')).not.toBeInTheDocument()
    expect(within(principal).queryByRole('navigation')).not.toBeInTheDocument()
  })
})