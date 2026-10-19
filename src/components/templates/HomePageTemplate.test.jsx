import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import HomePageTemplate from './HomePageTemplate'

function renderTemplate() {
  return render(
    <MemoryRouter>
      <HomePageTemplate content={<p>Contenido de prueba</p>} />
    </MemoryRouter>
  )
}

describe('HomePageTemplate', () => {
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

  it('el main ocupa el espacio disponible sin centrar el contenido', () => {
    renderTemplate()
    const principal = screen.getByRole('main')
    expect(principal).toHaveClass('flex-grow-1')
    expect(principal).not.toHaveClass('align-items-center')
  })

  it('no muestra el Header ni el Footer dentro del main', () => {
    renderTemplate()
    const principal = screen.getByRole('main')
    expect(within(principal).queryByRole('contentinfo')).not.toBeInTheDocument()
    expect(within(principal).queryByRole('navigation')).not.toBeInTheDocument()
  })
})