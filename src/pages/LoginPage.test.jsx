import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import LoginPage from './LoginPage'

describe('LoginPage', () => {
  it('muestra el título y el formulario de inicio de sesión', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { name: 'Inicio de sesión' })).toBeInTheDocument()
  })
})