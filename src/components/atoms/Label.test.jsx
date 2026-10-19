import { render, screen } from '@testing-library/react'
import Label from './Label'

describe('Label', () => {
  it('muestra el texto recibido por props', () => {
    render(<Label htmlFor="correo" text="Correo electrónico" />)
    expect(screen.getByText('Correo electrónico')).toBeInTheDocument()
  })

  it('queda asociado al campo indicado en htmlFor', () => {
    render(<Label htmlFor="correo" text="Correo electrónico" />)
    expect(screen.getByText('Correo electrónico')).toHaveAttribute('for', 'correo')
  })

  it('tiene la clase form-label de Bootstrap', () => {
    render(<Label htmlFor="correo" text="Correo electrónico" />)
    expect(screen.getByText('Correo electrónico')).toHaveClass('form-label')
  })
})