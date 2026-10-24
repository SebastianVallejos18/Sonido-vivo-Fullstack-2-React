import {
  obtenerUsuarios,
  obtenerUsuario,
  crearUsuario,
  actualizarUsuario,
  desactivarUsuario,
  activarUsuario,
} from './usuariosService'


const datosNuevos = {
  nombre: 'Camila Rojas',
  correo: 'camila@correo.com',
  rol: 'Cliente',
}

describe('usuariosService (CRUD con persistencia)', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('obtenerUsuarios', () => {
    it('lista los usuarios iniciales cuando no hay nada guardado', () => {
      expect(obtenerUsuarios()).toHaveLength(4)
    })

    it('los usuarios iniciales incluyen un administrador activo', () => {
      const administradores = obtenerUsuarios().filter(
        (usuario) => usuario.rol === 'Administrador' && usuario.activo
      )
      expect(administradores).toHaveLength(1)
    })

    it('devuelve los usuarios iniciales si lo guardado está dañado', () => {
      localStorage.setItem('usuarios', '{esto no es json')
      expect(obtenerUsuarios()).toHaveLength(4)
    })
  })

  describe('obtenerUsuario', () => {
    it('encuentra un usuario por su id', () => {
      expect(obtenerUsuario(1).rol).toBe('Administrador')
    })

    it('devuelve null si el usuario no existe', () => {
      expect(obtenerUsuario(99)).toBeNull()
    })
  })

  describe('crearUsuario', () => {
    it('crea un usuario con un id nuevo y activo', () => {
      const nuevo = crearUsuario(datosNuevos)

      expect(nuevo.id).toBe(5)
      expect(nuevo.activo).toBe(true)
      expect(nuevo.rol).toBe('Cliente')
    })

    it('guarda el nombre y el correo sin espacios sobrantes', () => {
      const nuevo = crearUsuario({ ...datosNuevos, nombre: '  Camila Rojas  ', correo: ' camila@correo.com ' })

      expect(nuevo.nombre).toBe('Camila Rojas')
      expect(nuevo.correo).toBe('camila@correo.com')
    })

    it('conserva los cambios entre lecturas (persistencia)', () => {
      crearUsuario(datosNuevos)

      expect(obtenerUsuarios()).toHaveLength(5)
      expect(obtenerUsuario(5).nombre).toBe('Camila Rojas')
    })

    it('lanza un error si el nombre está vacío', () => {
      expect(() => crearUsuario({ ...datosNuevos, nombre: '' })).toThrow('Por favor ingresa el nombre.')
    })

    it('lanza un error si el correo es inválido', () => {
      expect(() => crearUsuario({ ...datosNuevos, correo: 'correo-malo' })).toThrow(/correo válido/)
    })

    it('lanza un error si el rol no existe', () => {
      expect(() => crearUsuario({ ...datosNuevos, rol: 'Superusuario' })).toThrow('Selecciona un rol válido.')
    })

    it('lanza un error si el correo ya existe, sin importar las mayúsculas', () => {
      expect(() =>
        crearUsuario({ ...datosNuevos, correo: 'DUENO@SONIDOVIVO.CL' })
      ).toThrow('Ya existe un usuario con ese correo')
    })
  })

  describe('actualizarUsuario', () => {
    it('actualiza solo los campos indicados', () => {
      const actualizado = actualizarUsuario(4, { nombre: 'Cliente Frecuente' })

      expect(actualizado.nombre).toBe('Cliente Frecuente')
      expect(actualizado.correo).toBe('cliente@correo.com')
      expect(actualizado.rol).toBe('Cliente')
    })

    it('cambia el rol de un usuario', () => {
      expect(actualizarUsuario(4, { rol: 'Vendedor' }).rol).toBe('Vendedor')
      expect(obtenerUsuario(4).rol).toBe('Vendedor')
    })

    it('no permite cambiar el id ni el estado desde aquí', () => {
      const actualizado = actualizarUsuario(4, { id: 99, activo: false })

      expect(actualizado.id).toBe(4)
      expect(actualizado.activo).toBe(true)
    })

    it('permite conservar su propio correo', () => {
      expect(() => actualizarUsuario(4, { correo: 'cliente@correo.com' })).not.toThrow()
    })

    it('lanza un error si el correo pertenece a otro usuario', () => {
      expect(() =>
        actualizarUsuario(4, { correo: 'vendedor1@sonidovivo.cl' })
      ).toThrow('Ya existe un usuario con ese correo')
    })

    it('lanza un error si el usuario no existe', () => {
      expect(() => actualizarUsuario(99, { nombre: 'Nadie' })).toThrow('El usuario no existe')
    })

    it('no deja cambiar el rol del último administrador activo', () => {
      expect(() =>
        actualizarUsuario(1, { rol: 'Cliente' })
      ).toThrow('Debe quedar al menos un administrador activo')
    })
  })

  describe('desactivarUsuario y activarUsuario', () => {
    it('desactiva un usuario sin borrarlo', () => {
      desactivarUsuario(4)

      expect(obtenerUsuario(4).activo).toBe(false)
      expect(obtenerUsuarios()).toHaveLength(4)
    })

    it('vuelve a activar un usuario desactivado', () => {
      desactivarUsuario(4)
      activarUsuario(4)

      expect(obtenerUsuario(4).activo).toBe(true)
    })

    it('no deja desactivar al último administrador activo', () => {
      expect(() => desactivarUsuario(1)).toThrow('Debe quedar al menos un administrador activo')
    })

    it('permite desactivar a un administrador si hay otro activo', () => {
      crearUsuario({ nombre: 'Segundo Admin', correo: 'admin2@sonidovivo.cl', rol: 'Administrador' })

      desactivarUsuario(1)

      expect(obtenerUsuario(1).activo).toBe(false)
    })

    it('lanza un error si el usuario no existe', () => {
      expect(() => desactivarUsuario(99)).toThrow('El usuario no existe')
      expect(() => activarUsuario(99)).toThrow('El usuario no existe')
    })
  })
})