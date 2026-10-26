import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ContactPage from './ContactPage'

describe('ContactPage', () => {
  it('muestra el título del formulario de contacto', () => {
    render(
      <MemoryRouter>
        <ContactPage />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { name: 'Contacto' })).toBeInTheDocument()
  })
})
