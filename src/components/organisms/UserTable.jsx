function UserTable(props) {
  if (props.users.length === 0) {
    return <p className="text-muted">No hay usuarios registrados.</p>;
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead>
          <tr>
            <th scope="col">Nombre</th>
            <th scope="col">Correo</th>
            <th scope="col">Rol</th>
            <th scope="col">Estado</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {props.users.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.nombre}</td>
              <td>{usuario.correo}</td>
              <td>{usuario.rol}</td>
              <td>
                <span
                  className={usuario.activo ? "badge bg-success" : "badge bg-secondary"}
                >
                  {usuario.activo ? "Activo" : "Inactivo"}
                </span>
              </td>
              <td>
                <div className="d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    aria-label={"Editar a " + usuario.nombre}
                    onClick={() => props.onEdit(usuario)}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className={
                      usuario.activo
                        ? "btn btn-outline-danger btn-sm"
                        : "btn btn-outline-success btn-sm"
                    }
                    aria-label={
                      (usuario.activo ? "Desactivar a " : "Activar a ") + usuario.nombre
                    }
                    onClick={() => props.onToggle(usuario)}
                  >
                    {usuario.activo ? "Desactivar" : "Activar"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;