import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from './Button'

describe('Button', () => {
  it('muestra el texto recibido por props', () => {
    render(<Button text="Iniciar sesión" />)
    expect(screen.getByRole('button', { name: 'Iniciar sesión' })).toBeInTheDocument()
  })

  it('usa type="button" y variante primary por defecto', () => {
    render(<Button text="Aceptar" />)
    const boton = screen.getByRole('button', { name: 'Aceptar' })
    expect(boton).toHaveAttribute('type', 'button')
    expect(boton).toHaveClass('btn', 'btn-primary')
  })

  it('aplica el type y la variante recibidos por props', () => {
    render(<Button text="Enviar" type="submit" variant="danger" />)
    const boton = screen.getByRole('button', { name: 'Enviar' })
    expect(boton).toHaveAttribute('type', 'submit')
    expect(boton).toHaveClass('btn-danger')
  })

  it('llama a onClick al hacer clic', async () => {
    const user = userEvent.setup()
    const fakeClick = vi.fn()
    render(<Button text="Enviar" onClick={fakeClick} />)

    await user.click(screen.getByRole('button', { name: 'Enviar' }))

    expect(fakeClick).toHaveBeenCalledTimes(1)
  })
})