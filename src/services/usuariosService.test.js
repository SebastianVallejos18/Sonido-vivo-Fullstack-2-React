import { api } from './api'
import {
  obtenerUsuarios,
  crearUsuario,
  actualizarUsuario,
  desactivarUsuario,
  activarUsuario,
} from './usuariosService'

// Se reemplaza Axios por funciones falsas: así no se llama a la API real
vi.mock('./api', () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn(), patch: vi.fn() },
}))

const usuarioApi = { id: 2, nombre: 'Vendedor Uno', email: 'v1@sonidovivo.cl', rol: 'VENDEDOR', activo: true }
const usuarioVista = { id: 2, nombre: 'Vendedor Uno', correo: 'v1@sonidovivo.cl', rol: 'Vendedor', activo: true }

describe('usuariosService (API con Axios)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('obtenerUsuarios hace GET /usuarios y traduce email y rol', async () => {
    api.get.mockResolvedValue({ data: [usuarioApi] })

    const usuarios = await obtenerUsuarios()

    expect(api.get).toHaveBeenCalledWith('/usuarios')
    expect(usuarios).toEqual([usuarioVista])
  })

  it('crearUsuario hace POST con el formato de la API (incluye password)', async () => {
    api.post.mockResolvedValue({ data: usuarioApi })

    const creado = await crearUsuario({
      nombre: ' Vendedor Uno ',
      correo: 'V1@SonidoVivo.cl',
      rol: 'Vendedor',
      password: 'clave1234',
    })

    expect(api.post).toHaveBeenCalledWith('/usuarios', {
      nombre: 'Vendedor Uno',
      email: 'v1@sonidovivo.cl',
      rol: 'VENDEDOR',
      password: 'clave1234',
    })
    expect(creado).toEqual(usuarioVista)
  })

  it('actualizarUsuario hace PUT /usuarios/:id sin password', async () => {
    api.put.mockResolvedValue({ data: { ...usuarioApi, rol: 'ADMIN' } })

    const actualizado = await actualizarUsuario(2, {
      nombre: 'Vendedor Uno',
      correo: 'v1@sonidovivo.cl',
      rol: 'Administrador',
    })

    expect(api.put).toHaveBeenCalledWith('/usuarios/2', {
      nombre: 'Vendedor Uno',
      email: 'v1@sonidovivo.cl',
      rol: 'ADMIN',
    })
    expect(actualizado.rol).toBe('Administrador')
  })

  it('desactivarUsuario hace DELETE /usuarios/:id', async () => {
    api.delete.mockResolvedValue({ data: { ...usuarioApi, activo: false } })

    const usuario = await desactivarUsuario(2)

    expect(api.delete).toHaveBeenCalledWith('/usuarios/2')
    expect(usuario.activo).toBe(false)
  })

  it('activarUsuario hace PATCH /usuarios/:id/activar', async () => {
    api.patch.mockResolvedValue({ data: usuarioApi })

    const usuario = await activarUsuario(2)

    expect(api.patch).toHaveBeenCalledWith('/usuarios/2/activar')
    expect(usuario.activo).toBe(true)
  })

  it('si la API responde con error, el error llega a quien llamó', async () => {
    const error = { response: { status: 409, data: { error: 'El email ya está registrado' } } }
    api.post.mockRejectedValue(error)

    await expect(
      crearUsuario({ nombre: 'X', correo: 'x@x.cl', rol: 'Cliente', password: 'clave1234' })
    ).rejects.toBe(error)
  })
})