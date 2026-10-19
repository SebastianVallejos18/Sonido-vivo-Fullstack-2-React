import { render, screen } from '@testing-library/react'
import ProductVideo from './ProductVideo'

describe('ProductVideo', () => {
  it('muestra el título de la sección', () => {
    render(<ProductVideo />)
    expect(screen.getByRole('heading', { level: 2, name: 'Demostración de Productos' })).toBeInTheDocument()
  })

  it('incluye el video de YouTube con su título accesible', () => {
    render(<ProductVideo />)

    const video = screen.getByTitle('Demostración de productos - Sonido Vivo')
    expect(video).toHaveAttribute('src', 'https://www.youtube.com/embed/F6ge8PeSI_o')
  })

  it('permite ver el video en pantalla completa', () => {
    render(<ProductVideo />)
    expect(screen.getByTitle('Demostración de productos - Sonido Vivo')).toHaveAttribute('allowfullscreen')
  })

  it('la sección tiene el id video-promocional', () => {
    const { container } = render(<ProductVideo />)
    expect(container.querySelector('section')).toHaveAttribute('id', 'video-promocional')
  })
})