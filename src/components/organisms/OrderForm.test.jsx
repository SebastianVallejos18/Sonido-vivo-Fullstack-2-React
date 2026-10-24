import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import OrderForm from './OrderForm'

async function completarDatosBasicos(user) {
  await user.type(screen.getByLabelText('Nombre completo'), 'Juan Pérez')
  await user.type(screen.getByLabelText('Correo electrónico'), 'juan@correo.com')
  await user.type(screen.getByLabelText('Número de teléfono'), '+56912345678')
}

describe('OrderForm', () => {
  it('muestra los campos, las opciones de entrega y el botón', () => {
    render(<OrderForm />)

    expect(screen.getByLabelText('Nombre completo')).toBeInTheDocument()
    expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument()
    expect(screen.getByLabelText('Número de teléfono')).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Despacho a domicilio' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Retiro en tienda' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Confirmar pedido' })).toBeInTheDocument()
  })

  it('tiene seleccionado el despacho y muestra la dirección por defecto', () => {
    render(<OrderForm />)

    expect(screen.getByRole('radio', { name: 'Despacho a domicilio' })).toBeChecked()
    expect(screen.getByLabelText('Dirección de despacho')).toBeInTheDocument()
  })

  it('oculta la dirección al elegir retiro en tienda', async () => {
    const user = userEvent.setup()
    render(<OrderForm />)

    await user.click(screen.getByRole('radio', { name: 'Retiro en tienda' }))

    expect(screen.getByRole('radio', { name: 'Retiro en tienda' })).toBeChecked()
    expect(screen.queryByLabelText('Dirección de despacho')).not.toBeInTheDocument()
  })

  it('muestra los errores y no envía si el formulario está vacío', async () => {
    const user = userEvent.setup()
    const fakeSubmit = vi.fn()
    render(<OrderForm onSubmit={fakeSubmit} />)

    await user.click(screen.getByRole('button', { name: 'Confirmar pedido' }))

    expect(screen.getByText('Por favor ingresa tu nombre.')).toBeInTheDocument()
    expect(screen.getByText(/Ingresa un correo válido/)).toBeInTheDocument()
    expect(screen.getByText(/Ingresa un número chileno válido/)).toBeInTheDocument()
    expect(screen.getByText(/Ingresa una dirección de despacho/)).toBeInTheDocument()
    expect(fakeSubmit).not.toHaveBeenCalled()
  })

  it('exige la dirección si el método es despacho', async () => {
    const user = userEvent.setup()
    const fakeSubmit = vi.fn()
    render(<OrderForm onSubmit={fakeSubmit} />)

    await completarDatosBasicos(user)
    await user.click(screen.getByRole('button', { name: 'Confirmar pedido' }))

    expect(screen.getByText(/Ingresa una dirección de despacho/)).toBeInTheDocument()
    expect(fakeSubmit).not.toHaveBeenCalled()
  })

  it('envía los datos cuando todo es válido con despacho', async () => {
    const user = userEvent.setup()
    const fakeSubmit = vi.fn()
    render(<OrderForm onSubmit={fakeSubmit} />)

    await completarDatosBasicos(user)
    await user.type(screen.getByLabelText('Dirección de despacho'), 'Av. Libertad 123')
    await user.click(screen.getByRole('button', { name: 'Confirmar pedido' }))

    expect(fakeSubmit).toHaveBeenCalledTimes(1)
    expect(fakeSubmit).toHaveBeenCalledWith({
      nombre: 'Juan Pérez',
      correo: 'juan@correo.com',
      telefono: '+56912345678',
      metodo: 'despacho',
      direccion: 'Av. Libertad 123',
    })
  })

  it('envía los datos con retiro en tienda sin pedir dirección', async () => {
    const user = userEvent.setup()
    const fakeSubmit = vi.fn()
    render(<OrderForm onSubmit={fakeSubmit} />)

    await completarDatosBasicos(user)
    await user.click(screen.getByRole('radio', { name: 'Retiro en tienda' }))
    await user.click(screen.getByRole('button', { name: 'Confirmar pedido' }))

    expect(fakeSubmit).toHaveBeenCalledTimes(1)
    expect(fakeSubmit.mock.calls[0][0].metodo).toBe('retiro')
  })

  it('marca como válidos los campos correctos después de enviar', async () => {
    const user = userEvent.setup()
    render(<OrderForm onSubmit={() => {}} />)

    await user.type(screen.getByLabelText('Nombre completo'), 'Juan Pérez')
    await user.click(screen.getByRole('button', { name: 'Confirmar pedido' }))

    expect(screen.getByLabelText('Nombre completo')).toHaveClass('is-valid')
    expect(screen.getByLabelText('Correo electrónico')).toHaveClass('is-invalid')
  })
})