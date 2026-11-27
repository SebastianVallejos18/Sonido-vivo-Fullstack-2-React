import { useEffect, useState } from "react";
import HomePageTemplate from "../components/templates/HomePageTemplate";
import UserTable from "../components/organisms/UserTable";
import UserForm from "../components/organisms/UserForm";
import {
  obtenerUsuarios,
  crearUsuario,
  actualizarUsuario,
  desactivarUsuario,
  activarUsuario,
} from "../services/usuariosService";
import { obtenerMensajeError } from "../services/authService";

function AdminUsersPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState(null);
  const [versionFormulario, setVersionFormulario] = useState(0);
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");

    // Pide la lista a la API y la guarda en el estado
  async function cargarUsuarios() {
    try {
      const lista = await obtenerUsuarios();
      setUsuarios(lista);
    } catch (e) {
      setError(obtenerMensajeError(e));
    } finally {
      setCargando(false);
    }
  }

  // Al entrar a la página se carga la lista una vez (la API es un sistema externo)
  useEffect(() => {
    obtenerUsuarios()
      .then((lista) => setUsuarios(lista))
      .catch((e) => setError(obtenerMensajeError(e)))
      .finally(() => setCargando(false));
  }, []);

  async function handleSubmit(datos) {
    try {
      if (editando) {
        await actualizarUsuario(editando.id, datos);
        setAviso("Usuario actualizado correctamente.");
      } else {
        await crearUsuario(datos);
        setAviso("Usuario creado correctamente.");
      }

      await cargarUsuarios();
      setEditando(null);
      setVersionFormulario(versionFormulario + 1);
      setError("");
    } catch (e) {
      setError(obtenerMensajeError(e));
      setAviso("");
    }
  }

  function handleEdit(usuario) {
    setEditando(usuario);
    setError("");
    setAviso("");
  }

  function handleCancel() {
    setEditando(null);
    setError("");
  }

  async function handleToggle(usuario) {
    try {
      if (usuario.activo) {
        await desactivarUsuario(usuario.id);
        setAviso("Usuario desactivado.");
      } else {
        await activarUsuario(usuario.id);
        setAviso("Usuario activado.");
      }

      await cargarUsuarios();
      setError("");
    } catch (e) {
      setError(obtenerMensajeError(e));
      setAviso("");
    }
  }

  const claveFormulario = (editando ? editando.id : "nuevo") + "-" + versionFormulario;

  return (
    <HomePageTemplate
      content={
        <div className="container my-4">
          <h2 className="mb-1">Panel de administración</h2>
          <p className="text-muted mb-4">
            Crea usuarios, edítalos, asigna roles y desactiva cuentas.
          </p>

          {error ? (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          ) : null}

          {aviso ? (
            <div className="alert alert-success" role="status">
              {aviso}
            </div>
          ) : null}

          <div className="row g-4">
            <div className="col-12 col-lg-4">
              <UserForm
                key={claveFormulario}
                user={editando}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
              />
            </div>

            <div className="col-12 col-lg-8">
              <h2 className="h4 mb-3">Usuarios del sistema</h2>
              {cargando ? (
                <p className="text-muted">Cargando usuarios...</p>
              ) : (
                <UserTable
                  users={usuarios}
                  onEdit={handleEdit}
                  onToggle={handleToggle}
                />
              )}
            </div>
          </div>
        </div>
      }
    />
  );
}

export default AdminUsersPage;