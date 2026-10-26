import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('arranca en el inicio con el router configurado', () => {
    render(<App />)

    expect(screen.getByRole('heading', { level: 2, name: 'Productos destacados' })).toBeInTheDocument()
  })
})
