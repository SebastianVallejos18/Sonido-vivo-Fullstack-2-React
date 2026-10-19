import { parsearPrecio, formatearPrecio, calcularTotal, aplicarDescuento } from './precios'

describe('parsearPrecio', () => {
  it('convierte un precio con formato a número', () => {
    expect(parsearPrecio('$129.990')).toBe(129990)
  })

  it('convierte precios de cuatro cifras', () => {
    expect(parsearPrecio('$8.990')).toBe(8990)
  })
})

describe('formatearPrecio', () => {
  it('agrega el símbolo $ y el separador de miles', () => {
    expect(formatearPrecio(129990)).toBe('$129.990')
  })

  it('formatea precios de cuatro cifras', () => {
    expect(formatearPrecio(8990)).toBe('$8.990')
  })

  it('formatea millones', () => {
    expect(formatearPrecio(1000000)).toBe('$1.000.000')
  })

  it('formatea el cero', () => {
    expect(formatearPrecio(0)).toBe('$0')
  })

  it('es la operación inversa de parsearPrecio', () => {
    expect(formatearPrecio(parsearPrecio('$349.990'))).toBe('$349.990')
  })
})

describe('calcularTotal', () => {
  it('suma precio por cantidad de cada ítem', () => {
    const items = [
      { nombre: 'Cable', precio: '$12.990', cantidad: 2 },
      { nombre: 'Púas', precio: '$3.990', cantidad: 1 },
    ]
    expect(calcularTotal(items)).toBe(29970)
  })

  it('devuelve 0 si el carrito está vacío', () => {
    expect(calcularTotal([])).toBe(0)
  })
})

describe('aplicarDescuento', () => {
  it('aplica un 10% de descuento', () => {
    expect(aplicarDescuento(100000, 10)).toBe(90000)
  })

  it('con 0% el precio no cambia', () => {
    expect(aplicarDescuento(50000, 0)).toBe(50000)
  })

  it('con 100% el precio queda en 0', () => {
    expect(aplicarDescuento(50000, 100)).toBe(0)
  })

  it('lanza un error si el porcentaje es mayor a 100', () => {
    expect(() => aplicarDescuento(50000, 101)).toThrow('El porcentaje debe estar entre 0 y 100')
  })

  it('lanza un error si el porcentaje es negativo', () => {
    expect(() => aplicarDescuento(50000, -5)).toThrow('El porcentaje debe estar entre 0 y 100')
  })
})