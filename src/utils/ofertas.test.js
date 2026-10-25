import { aplicarOfertas, obtenerOfertas } from './ofertas'

const categorias = [
  {
    id: 'guitarras',
    titulo: 'Guitarras',
    productos: [
      { nombre: 'Guitarra Acústica Folk', precio: '$129.990', descripcion: 'Tapa de abeto.', descuento: 20 },
      { nombre: 'Guitarra Eléctrica Stratocaster', precio: '$249.990', descripcion: 'Cuerpo de álamo.' },
    ],
  },
  {
    id: 'microfonos',
    titulo: 'Micrófonos',
    productos: [
      { nombre: 'Micrófono Dinámico', precio: '$149.990', descripcion: 'Voz en vivo.', descuento: 10 },
    ],
  },
]

describe('aplicarOfertas', () => {
  it('deja igual los productos sin descuento', () => {
    const resultado = aplicarOfertas(categorias)

    expect(resultado[0].productos[1]).toEqual(categorias[0].productos[1])
    expect(resultado[0].productos[1].precioOriginal).toBeUndefined()
  })

  it('recalcula el precio de los productos con descuento', () => {
    const resultado = aplicarOfertas(categorias)

    // 129.990 con 20% = 103.992
    expect(resultado[0].productos[0].precio).toBe('$103.992')
    // 149.990 con 10% = 134.991
    expect(resultado[1].productos[0].precio).toBe('$134.991')
  })

  it('guarda el precio anterior en precioOriginal', () => {
    const resultado = aplicarOfertas(categorias)
    expect(resultado[0].productos[0].precioOriginal).toBe('$129.990')
  })

  it('conserva el descuento y el resto de los datos del producto', () => {
    const producto = aplicarOfertas(categorias)[0].productos[0]

    expect(producto.nombre).toBe('Guitarra Acústica Folk')
    expect(producto.descripcion).toBe('Tapa de abeto.')
    expect(producto.descuento).toBe(20)
  })

  it('no modifica los datos originales', () => {
    aplicarOfertas(categorias)

    expect(categorias[0].productos[0].precio).toBe('$129.990')
    expect(categorias[0].productos[0].precioOriginal).toBeUndefined()
  })
})

describe('obtenerOfertas', () => {
  it('devuelve solo los productos con descuento', () => {
    const ofertas = obtenerOfertas(categorias)

    expect(ofertas).toHaveLength(2)
    expect(ofertas.map((producto) => producto.nombre)).toEqual([
      'Guitarra Acústica Folk',
      'Micrófono Dinámico',
    ])
  })

  it('devuelve una lista vacía si no hay ofertas', () => {
    const sinOfertas = [{ id: 'a', titulo: 'A', productos: [{ nombre: 'X', precio: '$1.000', descripcion: 'x' }] }]
    expect(obtenerOfertas(sinOfertas)).toEqual([])
  })

  it('funciona con los datos ya procesados por aplicarOfertas', () => {
    const ofertas = obtenerOfertas(aplicarOfertas(categorias))

    expect(ofertas).toHaveLength(2)
    expect(ofertas[0].precioOriginal).toBe('$129.990')
  })
})