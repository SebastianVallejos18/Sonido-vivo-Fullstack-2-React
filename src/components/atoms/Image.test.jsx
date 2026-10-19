import { render, screen } from '@testing-library/react'
import Image from './Image'

describe('Image', () => {
  it('muestra la imagen con el src y el alt recibidos por props', () => {
    render(<Image src="guitarra.jpg" alt="Guitarra acústica" />)

    const imagen = screen.getByAltText('Guitarra acústica')
    expect(imagen).toHaveAttribute('src', 'guitarra.jpg')
  })
})