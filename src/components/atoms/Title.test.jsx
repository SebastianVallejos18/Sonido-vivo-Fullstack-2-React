import { render, screen } from '@testing-library/react'
import Title from './Title'

describe('Title', () => {
  it('muestra el texto recibido por props', () => {
    render(<Title level="h3" text="Guitarra acústica" />)
    expect(screen.getByText('Guitarra acústica')).toBeInTheDocument()
  })

  it('se renderiza con el nivel de encabezado indicado', () => {
    render(<Title level="h3" text="Guitarra acústica" />)
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument()
  })

  it('aplica la clase recibida por props', () => {
    render(<Title level="h3" text="Hola" className="text-center" />)
    expect(screen.getByText('Hola')).toHaveClass('text-center')
  })
})