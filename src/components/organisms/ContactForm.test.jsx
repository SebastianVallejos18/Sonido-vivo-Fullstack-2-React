import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ContactForm from './ContactForm'

describe('ContactForm', () => {
  it('muestra el título, la introducción, los campos y el botón', () => {
    render(<ContactForm />)

    expect(screen.getByRole('heading', { name: 'Contacto' })).toBeInTheDocument()
    expect(screen.getByText(/¿Tienes dudas sobre algún producto/)).toBeInTheDocument()
    expect(screen.getByLabelText('Nombre completo')).toBeInTheDocument()
    expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument()
    expect(screen.getByLabelText('Mensaje')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Enviar mensaje' })).toBeInTheDocument()
  })

  it('el campo de mensaje es un textarea', () => {
    render(<ContactForm />)
    expect(screen.getByLabelText('Mensaje').tagName).toBe('TEXTAREA')
  })

  it('no muestra errores ni avisos antes de enviar', () => {
    render(<ContactForm />)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.queryByText(/Por favor ingresa tu nombre/)).not.toBeInTheDocument()
  })

  it('muestra los tres errores y el aviso si se envía vacío', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    await user.click(screen.getByRole('button', { name: 'Enviar mensaje' }))

    expect(screen.getByText('Por favor ingresa tu nombre.')).toBeInTheDocument()
    expect(screen.getByText(/Ingresa un correo válido/)).toBeInTheDocument()
    expect(screen.getByText('Tu mensaje debe tener al menos 10 caracteres.')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveClass('alert-danger')
    expect(screen.getByLabelText('Nombre completo')).toHaveClass('is-invalid')
  })

  it('muestra solo el error del correo si el correo es inválido', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    await user.type(screen.getByLabelText('Nombre completo'), 'Juan Pérez')
    await user.type(screen.getByLabelText('Correo electrónico'), 'correo-malo')
    await user.type(screen.getByLabelText('Mensaje'), 'Quiero consultar por una guitarra')
    await user.click(screen.getByRole('button', { name: 'Enviar mensaje' }))

    expect(screen.getByText(/Ingresa un correo válido/)).toBeInTheDocument()
    expect(screen.queryByText('Por favor ingresa tu nombre.')).not.toBeInTheDocument()
    expect(screen.queryByText(/al menos 10 caracteres/)).not.toBeInTheDocument()
  })

  it('rechaza un mensaje de 9 caracteres', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    await user.type(screen.getByLabelText('Nombre completo'), 'Juan Pérez')
    await user.type(screen.getByLabelText('Correo electrónico'), 'juan@correo.com')
    await user.type(screen.getByLabelText('Mensaje'), '123456789')
    await user.click(screen.getByRole('button', { name: 'Enviar mensaje' }))

    expect(screen.getByText('Tu mensaje debe tener al menos 10 caracteres.')).toBeInTheDocument()
  })

  it('acepta un mensaje de exactamente 10 caracteres', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    await user.type(screen.getByLabelText('Nombre completo'), 'Juan Pérez')
    await user.type(screen.getByLabelText('Correo electrónico'), 'juan@correo.com')
    await user.type(screen.getByLabelText('Mensaje'), '1234567890')
    await user.click(screen.getByRole('button', { name: 'Enviar mensaje' }))

    expect(screen.queryByText(/al menos 10 caracteres/)).not.toBeInTheDocument()
    expect(screen.getByText('¡Mensaje enviado correctamente!')).toBeInTheDocument()
  })

  it('no cuenta los espacios del inicio ni del final del mensaje', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    await user.type(screen.getByLabelText('Nombre completo'), 'Juan Pérez')
    await user.type(screen.getByLabelText('Correo electrónico'), 'juan@correo.com')
    await user.type(screen.getByLabelText('Mensaje'), '       hola       ')
    await user.click(screen.getByRole('button', { name: 'Enviar mensaje' }))

    expect(screen.getByText('Tu mensaje debe tener al menos 10 caracteres.')).toBeInTheDocument()
  })

  it('muestra el aviso de éxito y marca los campos como válidos si todo está bien', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    await user.type(screen.getByLabelText('Nombre completo'), 'Juan Pérez')
    await user.type(screen.getByLabelText('Correo electrónico'), 'juan@correo.com')
    await user.type(screen.getByLabelText('Mensaje'), 'Quiero consultar por una guitarra')
    await user.click(screen.getByRole('button', { name: 'Enviar mensaje' }))

    expect(screen.getByText('¡Mensaje enviado correctamente!')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveClass('alert-success')
    expect(screen.getByLabelText('Nombre completo')).toHaveClass('is-valid')
    expect(screen.getByLabelText('Correo electrónico')).toHaveClass('is-valid')
    expect(screen.getByLabelText('Mensaje')).toHaveClass('is-valid')
  })
})