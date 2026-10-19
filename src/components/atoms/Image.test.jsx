import { render, screen } from '@testing-library/react'
import Image from './Image'

describe('Image', () => {
  it('muestra la imagen con el src y el alt recibidos por props', () => {
    render(<Image src="guitarra.jpg" alt="Guitarra acústica" />)

    const imagen = screen.getByAltText('Guitarra acústica')
    expect(imagen).toBeInTheDocument()
    expect(imagen).toHaveAttribute('src', 'guitarra.jpg')
  })

  it('aplica la clase recibida por props', () => {
    render(<Image src="guitarra.jpg" alt="Guitarra" className="img-fluid" />)
    expect(screen.getByAltText('Guitarra')).toHaveClass('img-fluid')
  })
})