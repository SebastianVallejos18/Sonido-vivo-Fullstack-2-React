import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import RegisterPage from './RegisterPage'

describe('RegisterPage', () => {
  it('muestra el título y el formulario de registro', () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { name: 'Registrarse' })).toBeInTheDocument()
  })
})
