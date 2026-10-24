import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import CartList from './CartList'

const items = [
  { nombre: 'Guitarra Acústica Folk', imagen: '/guitarra.jpeg', precio: '$129.990', cantidad: 1 },
  { nombre: 'Cable Instrumento 3m', imagen: '/amplificador.jpeg', precio: '$12.990', cantidad: 2 },
]

function renderCart(props) {
  return render(
    <MemoryRouter>
      <CartList {...props} />
    </MemoryRouter>
  )
}

describe('CartList', () => {
  describe('con el carrito vacío', () => {
    it('muestra el mensaje de carrito vacío', () => {
      renderCart({ items: [] })
      expect(screen.getByRole('heading', { name: 'Tu carrito está vacío' })).toBeInTheDocument()
    })

    it('ofrece un enlace al catálogo', () => {
      renderCart({ items: [] })
      expect(screen.getByRole('link', { name: 'Ver productos' })).toHaveAttribute('href', '/catalogo')
    })

    it('no muestra el resumen ni el botón de confirmar', () => {
      renderCart({ items: [] })
      expect(screen.queryByText('Resumen del pedido')).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Confirmar pedido' })).not.toBeInTheDocument()
    })
  })

  describe('con productos', () => {
    it('muestra el título del carrito', () => {
      renderCart({ items })
      expect(screen.getByRole('heading', { level: 2, name: 'Mi carrito' })).toBeInTheDocument()
    })

    it('muestra una tarjeta por cada producto', () => {
      renderCart({ items })

      expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(2)
      expect(screen.getByRole('heading', { level: 3, name: 'Guitarra Acústica Folk' })).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 3, name: 'Cable Instrumento 3m' })).toBeInTheDocument()
    })

    it('calcula el total y las unidades del resumen', () => {
      renderCart({ items })

      expect(screen.getByText('Total: $155.970')).toBeInTheDocument()
      expect(screen.getByText('Unidades: 3')).toBeInTheDocument()
    })

    it('llama a onIncrease con el nombre del producto', async () => {
      const user = userEvent.setup()
      const fakeIncrease = vi.fn()
      renderCart({ items, onIncrease: fakeIncrease })

      await user.click(screen.getByRole('button', { name: 'Aumentar cantidad de Cable Instrumento 3m' }))

      expect(fakeIncrease).toHaveBeenCalledWith('Cable Instrumento 3m')
    })

    it('llama a onDecrease con el nombre del producto', async () => {
      const user = userEvent.setup()
      const fakeDecrease = vi.fn()
      renderCart({ items, onDecrease: fakeDecrease })

      await user.click(screen.getByRole('button', { name: 'Disminuir cantidad de Cable Instrumento 3m' }))

      expect(fakeDecrease).toHaveBeenCalledWith('Cable Instrumento 3m')
    })

    it('llama a onRemove con el nombre del producto', async () => {
      const user = userEvent.setup()
      const fakeRemove = vi.fn()
      renderCart({ items, onRemove: fakeRemove })

      const botonesQuitar = screen.getAllByRole('button', { name: 'Quitar' })
      await user.click(botonesQuitar[0])

      expect(fakeRemove).toHaveBeenCalledWith('Guitarra Acústica Folk')
    })

    it('llama a onConfirm al confirmar el pedido', async () => {
      const user = userEvent.setup()
      const fakeConfirm = vi.fn()
      renderCart({ items, onConfirm: fakeConfirm })

      await user.click(screen.getByRole('button', { name: 'Confirmar pedido' }))

      expect(fakeConfirm).toHaveBeenCalledTimes(1)
    })
  })
})