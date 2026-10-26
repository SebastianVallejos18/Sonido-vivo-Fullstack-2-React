import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import HomePage from './HomePage'

describe('HomePage', () => {
  it('muestra los 4 productos destacados con su precio', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { level: 2, name: 'Productos destacados' })).toBeInTheDocument()
    expect(screen.getByText('Guitarra Acústica Folk')).toBeInTheDocument()
    expect(screen.getByText('Batería Electrónica 8 pads')).toBeInTheDocument()
    expect(screen.getByText('Teclado Digital 61 teclas')).toBeInTheDocument()
    expect(screen.getByText('Pedal Reverb')).toBeInTheDocument()
    expect(screen.getByText('$129.990')).toBeInTheDocument()
  })

  it('incluye la sección de demostración de productos', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { name: 'Demostración de Productos' })).toBeInTheDocument()
  })
})
