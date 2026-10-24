import { useState } from "react";
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

function AdminUsersPage() {
  const [usuarios, setUsuarios] = useState(obtenerUsuarios);
  const [editando, setEditando] = useState(null);
  const [versionFormulario, setVersionFormulario] = useState(0);
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");

  function handleSubmit(datos) {
    try {
      if (editando) {
        actualizarUsuario(editando.id, datos);
        setAviso("Usuario actualizado correctamente.");
      } else {
        crearUsuario(datos);
        setAviso("Usuario creado correctamente.");
      }

      setUsuarios(obtenerUsuarios());
      setEditando(null);
      setVersionFormulario(versionFormulario + 1);
      setError("");
    } catch (e) {
      setError(e.message);
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

  function handleToggle(usuario) {
    try {
      if (usuario.activo) {
        desactivarUsuario(usuario.id);
        setAviso("Usuario desactivado.");
      } else {
        activarUsuario(usuario.id);
        setAviso("Usuario activado.");
      }

      setUsuarios(obtenerUsuarios());
      setError("");
    } catch (e) {
      setError(e.message);
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
              <UserTable
                users={usuarios}
                onEdit={handleEdit}
                onToggle={handleToggle}
              />
            </div>
          </div>
        </div>
      }
    />
  );
}

export default AdminUsersPage;