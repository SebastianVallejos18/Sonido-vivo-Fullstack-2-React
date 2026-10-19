import { render, screen } from '@testing-library/react'
import Footer from './Footer'

describe('Footer', () => {
  it('muestra el texto de derechos y ubicación', () => {
    render(<Footer />)
    expect(screen.getByText('© 2026 Sonido Vivo - Viña del Mar, Chile')).toBeInTheDocument()
  })

  it('se renderiza como pie de página', () => {
    render(<Footer />)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })
})