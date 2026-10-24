import { normalizarTexto, filtrarCategorias } from './filtros'

const categorias = [
  {
    id: 'guitarras',
    titulo: 'Guitarras',
    productos: [
      { nombre: 'Guitarra Acústica Folk', precio: '$129.990', descripcion: 'Tapa de abeto. Ideal para iniciantes.' },
      { nombre: 'Guitarra Eléctrica Stratocaster', precio: '$249.990', descripcion: 'Cuerpo de álamo.' },
    ],
  },
  {
    id: 'microfonos',
    titulo: 'Micrófonos',
    productos: [
      { nombre: 'Micrófono Dinámico', precio: '$149.990', descripcion: 'Estándar para voz en vivo.' },
      { nombre: 'Pop Filter', precio: '$14.990', descripcion: 'Doble malla.' },
    ],
  },
]

const sinFiltros = { texto: '', categoria: '', precioMax: '' }

function nombresDe(resultado) {
  return resultado.flatMap((categoria) => categoria.productos).map((producto) => producto.nombre)
}

describe('normalizarTexto', () => {
  it('quita las tildes', () => {
    expect(normalizarTexto('Micrófono')).toBe('microfono')
  })

  it('convierte la ñ en n', () => {
    expect(normalizarTexto('Niños')).toBe('ninos')
  })

  it('pasa todo a minúsculas', () => {
    expect(normalizarTexto('GUITARRA')).toBe('guitarra')
  })

  it('quita los espacios del inicio y del final', () => {
    expect(normalizarTexto('  bajo  ')).toBe('bajo')
  })
})

describe('filtrarCategorias', () => {
  it('devuelve todo si no hay filtros', () => {
    expect(filtrarCategorias(categorias, sinFiltros)).toEqual(categorias)
  })

  it('filtra por texto en el nombre', () => {
    const resultado = filtrarCategorias(categorias, { ...sinFiltros, texto: 'stratocaster' })

    expect(resultado).toHaveLength(1)
    expect(nombresDe(resultado)).toEqual(['Guitarra Eléctrica Stratocaster'])
  })

  it('también busca en la descripción', () => {
    const resultado = filtrarCategorias(categorias, { ...sinFiltros, texto: 'abeto' })

    expect(nombresDe(resultado)).toEqual(['Guitarra Acústica Folk'])
  })

  it('ignora mayúsculas y tildes al buscar', () => {
    expect(nombresDe(filtrarCategorias(categorias, { ...sinFiltros, texto: 'MICROFONO' }))).toEqual(['Micrófono Dinámico'])
    expect(nombresDe(filtrarCategorias(categorias, { ...sinFiltros, texto: 'acustica' }))).toEqual(['Guitarra Acústica Folk'])
  })

  it('filtra por categoría', () => {
    const resultado = filtrarCategorias(categorias, { ...sinFiltros, categoria: 'Micrófonos' })

    expect(resultado).toHaveLength(1)
    expect(resultado[0].id).toBe('microfonos')
    expect(resultado[0].productos).toHaveLength(2)
  })

  it('filtra por precio máximo', () => {
    const resultado = filtrarCategorias(categorias, { ...sinFiltros, precioMax: 150000 })

    expect(nombresDe(resultado)).toHaveLength(3)
    expect(nombresDe(resultado)).not.toContain('Guitarra Eléctrica Stratocaster')
  })

  it('incluye los productos cuyo precio es exactamente el máximo', () => {
    const resultado = filtrarCategorias(categorias, { ...sinFiltros, precioMax: 149990 })

    expect(nombresDe(resultado)).toContain('Micrófono Dinámico')
  })

  it('acepta el precio máximo como texto, como lo entrega un input', () => {
    const resultado = filtrarCategorias(categorias, { ...sinFiltros, precioMax: '15000' })

    expect(nombresDe(resultado)).toEqual(['Pop Filter'])
  })

  it('combina varios filtros a la vez', () => {
    const resultado = filtrarCategorias(categorias, {
      texto: 'guitarra',
      categoria: '',
      precioMax: 200000,
    })

    expect(nombresDe(resultado)).toEqual(['Guitarra Acústica Folk'])
  })

  it('descarta las categorías que quedan sin productos', () => {
    const resultado = filtrarCategorias(categorias, { ...sinFiltros, texto: 'pop' })

    expect(resultado).toHaveLength(1)
    expect(resultado[0].id).toBe('microfonos')
  })

  it('devuelve una lista vacía si nada coincide', () => {
    expect(filtrarCategorias(categorias, { ...sinFiltros, texto: 'zzzz' })).toEqual([])
  })

  it('no modifica los datos originales', () => {
    filtrarCategorias(categorias, { ...sinFiltros, texto: 'pop' })

    expect(categorias[0].productos).toHaveLength(2)
    expect(categorias[1].productos).toHaveLength(2)
  })
})