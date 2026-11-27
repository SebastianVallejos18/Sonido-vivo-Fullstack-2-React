import { crearSlug, buscarProducto, agruparPorCategoria } from './productos'

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

describe('agruparPorCategoria', () => {
  const desdeApi = [
    { id: 1, nombre: 'Guitarra Folk', descripcion: 'd', imagen: '/g.jpeg', precio: 129990, stock: 10, descuento: 20, categoria_slug: 'guitarras', categoria: 'Guitarras' },
    { id: 2, nombre: 'Bajo 4', descripcion: 'd', imagen: '/b.jpeg', precio: 299990, stock: 3, descuento: 0, categoria_slug: 'bajos', categoria: 'Bajos' },
    { id: 3, nombre: 'Guitarra SG', descripcion: 'd', imagen: '/g.jpeg', precio: 319990, stock: 0, descuento: 0, categoria_slug: 'guitarras', categoria: 'Guitarras' },
    { id: 4, nombre: 'Sin categoría', descripcion: 'd', imagen: null, precio: 1000, stock: 1, descuento: 0, categoria_slug: null, categoria: null },
  ]

  it('agrupa los productos en categorías respetando el orden', () => {
    const categorias = agruparPorCategoria(desdeApi)
    expect(categorias.map((c) => c.id)).toEqual(['guitarras', 'bajos'])
    expect(categorias[0].productos.map((p) => p.nombre)).toEqual(['Guitarra Folk', 'Guitarra SG'])
  })

  it('formatea el precio, conserva id y stock, y deja descuento solo si es mayor a 0', () => {
    const [guitarras] = agruparPorCategoria(desdeApi)
    expect(guitarras.productos[0]).toMatchObject({ id: 1, precio: '$129.990', stock: 10, descuento: 20 })
    expect(guitarras.productos[1].descuento).toBeUndefined()
  })

  it('ignora los productos sin categoría', () => {
    const nombres = agruparPorCategoria(desdeApi).flatMap((c) => c.productos.map((p) => p.nombre))
    expect(nombres).not.toContain('Sin categoría')
  })
})