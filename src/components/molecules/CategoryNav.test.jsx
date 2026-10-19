import { render, screen } from '@testing-library/react'
import CategoryNav from './CategoryNav'

const categorias = [
  { id: 'guitarras', titulo: 'Guitarras' },
  { id: 'teclados', titulo: 'Teclados' },
  { id: 'percusion', titulo: 'Percusión' },
]

describe('CategoryNav', () => {
  it('muestra un enlace por cada categoría recibida', () => {
    render(<CategoryNav categorias={categorias} />)

    expect(screen.getAllByRole('link')).toHaveLength(3)
    expect(screen.getByRole('link', { name: 'Guitarras' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Teclados' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Percusión' })).toBeInTheDocument()
  })

  it('cada enlace apunta al id de su categoría', () => {
    render(<CategoryNav categorias={categorias} />)

    expect(screen.getByRole('link', { name: 'Guitarras' })).toHaveAttribute('href', '#guitarras')
    expect(screen.getByRole('link', { name: 'Teclados' })).toHaveAttribute('href', '#teclados')
  })

  it('se renderiza dentro de un elemento de navegación', () => {
    render(<CategoryNav categorias={categorias} />)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('no muestra enlaces si la lista de categorías está vacía', () => {
    render(<CategoryNav categorias={[]} />)
    expect(screen.queryAllByRole('link')).toHaveLength(0)
  })
})