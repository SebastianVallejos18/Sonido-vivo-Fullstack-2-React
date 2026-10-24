import { validarPedido, validarUsuario } from './validaciones'

const datosValidos = {
  nombre: 'Juan Pérez',
  correo: 'juan@correo.com',
  telefono: '+56912345678',
  metodo: 'retiro',
  direccion: '',
}

describe('validarPedido', () => {
  it('devuelve un objeto vacío si los datos de un retiro son válidos', () => {
    expect(validarPedido(datosValidos)).toEqual({})
  })

  it('devuelve un objeto vacío si los datos de un despacho son válidos', () => {
    const datos = { ...datosValidos, metodo: 'despacho', direccion: 'Av. Libertad 123' }
    expect(validarPedido(datos)).toEqual({})
  })

  it('marca error si el nombre está vacío', () => {
    const errores = validarPedido({ ...datosValidos, nombre: '   ' })
    expect(errores.nombre).toBe('Por favor ingresa tu nombre.')
  })

  it('marca error si el correo es inválido', () => {
    const errores = validarPedido({ ...datosValidos, correo: 'correo-malo' })
    expect(errores.correo).toMatch(/Ingresa un correo válido/)
  })

  it.each([['12345'], ['812345678'], ['abcdefghi']])(
    'marca error con el teléfono inválido "%s"',
    (telefono) => {
      const errores = validarPedido({ ...datosValidos, telefono })
      expect(errores.telefono).toMatch(/número chileno válido/)
    }
  )

  it('acepta un teléfono con espacios', () => {
    const errores = validarPedido({ ...datosValidos, telefono: '+56 9 1234 5678' })
    expect(errores.telefono).toBeUndefined()
  })

  it('exige dirección si el método es despacho', () => {
    const errores = validarPedido({ ...datosValidos, metodo: 'despacho', direccion: '' })
    expect(errores.direccion).toMatch(/dirección de despacho/)
  })

  it('rechaza una dirección demasiado corta en despacho', () => {
    const errores = validarPedido({ ...datosValidos, metodo: 'despacho', direccion: 'Av' })
    expect(errores.direccion).toBeDefined()
  })

  it('no exige dirección si el método es retiro', () => {
    const errores = validarPedido({ ...datosValidos, metodo: 'retiro', direccion: '' })
    expect(errores.direccion).toBeUndefined()
  })

  it('acumula varios errores a la vez', () => {
    const errores = validarPedido({ nombre: '', correo: '', telefono: '', metodo: 'despacho', direccion: '' })
    expect(Object.keys(errores)).toHaveLength(4)
  })
})

describe('validarUsuario', () => {
  const usuarioValido = { nombre: 'Camila Rojas', correo: 'camila@correo.com', rol: 'Cliente' }

  it('devuelve un objeto vacío si los datos son válidos', () => {
    expect(validarUsuario(usuarioValido)).toEqual({})
  })

  it('marca error si el nombre está vacío', () => {
    const errores = validarUsuario({ ...usuarioValido, nombre: '  ' })
    expect(errores.nombre).toBe('Por favor ingresa el nombre.')
  })

  it('marca error si el correo es inválido', () => {
    const errores = validarUsuario({ ...usuarioValido, correo: 'correo-malo' })
    expect(errores.correo).toMatch(/Ingresa un correo válido/)
  })

  it('marca error si el rol no existe', () => {
    const errores = validarUsuario({ ...usuarioValido, rol: 'Superusuario' })
    expect(errores.rol).toBe('Selecciona un rol válido.')
  })

  it('acepta los tres roles del sistema', () => {
    for (const rol of ['Administrador', 'Vendedor', 'Cliente']) {
      expect(validarUsuario({ ...usuarioValido, rol })).toEqual({})
    }
  })

  it('acumula varios errores a la vez', () => {
    const errores = validarUsuario({ nombre: '', correo: '', rol: '' })
    expect(Object.keys(errores)).toHaveLength(3)
  })
})