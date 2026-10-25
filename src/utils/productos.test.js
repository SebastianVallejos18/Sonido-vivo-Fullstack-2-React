import { crearSlug, buscarProducto } from './productos'

const categorias = [
  {
    id: 'guitarras',
    titulo: 'Guitarras',
    productos: [
      { nombre: 'Guitarra Acústica Folk', precio: '$129.990', descripcion: 'Tapa de abeto.' },
      { nombre: 'Guitarra Eléctrica Stratocaster', precio: '$249.990', descripcion: 'Cuerpo de álamo.' },
    ],
  },
  {
    id: 'microfonos',
    titulo: 'Micrófonos',
    productos: [
      { nombre: 'Micrófono Dinámico', precio: '$149.990', descripcion: 'Voz en vivo.' },
    ],
  },
]

describe('crearSlug', () => {
  it('pasa a minúsculas, quita tildes y usa guiones', () => {
    expect(crearSlug('Guitarra Acústica Folk')).toBe('guitarra-acustica-folk')
  })

  it('convierte símbolos y medidas en guiones', () => {
    expect(crearSlug('Púas de Guitarra x10 (0.73mm)')).toBe('puas-de-guitarra-x10-0-73mm')
  })

  it('maneja la ñ y las barras', () => {
    expect(crearSlug('Guitarra 3/4 Niños')).toBe('guitarra-3-4-ninos')
  })

  it('no deja guiones al inicio ni al final', () => {
    expect(crearSlug('  Bajo!  ')).toBe('bajo')
  })

  it('da slugs distintos a nombres distintos', () => {
    expect(crearSlug('Cable Instrumento 3m')).not.toBe(crearSlug('Cable Instrumento 6m'))
  })
})

describe('buscarProducto', () => {
  it('encuentra un producto por su slug e incluye su categoría', () => {
    const producto = buscarProducto(categorias, 'guitarra-acustica-folk')

    expect(producto.nombre).toBe('Guitarra Acústica Folk')
    expect(producto.categoria).toBe('Guitarras')
  })

  it('conserva los demás datos del producto', () => {
    const producto = buscarProducto(categorias, 'guitarra-acustica-folk')

    expect(producto.precio).toBe('$129.990')
    expect(producto.descripcion).toBe('Tapa de abeto.')
  })

  it('busca en todas las categorías', () => {
    expect(buscarProducto(categorias, 'microfono-dinamico').categoria).toBe('Micrófonos')
  })

  it('devuelve null si el producto no existe', () => {
    expect(buscarProducto(categorias, 'producto-inexistente')).toBeNull()
  })
})