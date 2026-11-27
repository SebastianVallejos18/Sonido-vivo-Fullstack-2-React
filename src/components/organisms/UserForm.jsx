import { useState } from "react";
import { Form } from "react-bootstrap";
import FormField from "../molecules/FormField";
import Button from "../atoms/Button";
import roles from "../../data/roles";
import { validarUsuario } from "../../utils/validaciones";

function UserForm(props) {
  const editando = Boolean(props.user);

  // Al crear se pide contraseña; al editar no (la API no la cambia desde aquí)
  const [formData, setFormData] = useState(
    editando
      ? { nombre: props.user.nombre, correo: props.user.correo, rol: props.user.rol }
      : { nombre: "", correo: "", rol: "", password: "" }
  );

  const [errors, setErrors] = useState({});

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const nuevosErrores = validarUsuario(formData);
    setErrors(nuevosErrores);

    if (Object.keys(nuevosErrores).length === 0) {
      props.onSubmit(formData);
    }
  }

  return (
    <div className="card shadow-sm p-4">
      <h2 className="h4 mb-3">{editando ? "Editar usuario" : "Nuevo usuario"}</h2>

      <Form onSubmit={handleSubmit} noValidate>
        <FormField
          id="nombre"
          label="Nombre"
          placeholder="Ej: Camila Rojas"
          value={formData.nombre}
          onChange={handleChange}
          autoComplete="off"
          error={errors.nombre}
        />

        <FormField
          id="correo"
          label="Correo electrónico"
          type="email"
          placeholder="ejemplo@correo.com"
          value={formData.correo}
          onChange={handleChange}
          autoComplete="off"
          error={errors.correo}
        />

        {editando ? null : (
          <FormField
            id="password"
            label="Contraseña"
            type="password"
            placeholder="Mínimo 8 caracteres"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            error={errors.password}
          />
        )}

        <FormField
          id="rol"
          label="Rol"
          type="select"
          placeholder="Selecciona un rol"
          options={roles}
          value={formData.rol}
          onChange={handleChange}
          error={errors.rol}
        />

        <div className="d-grid gap-2">
          <Button
            type="submit"
            variant="primary"
            text={editando ? "Guardar cambios" : "Crear usuario"}
          />
          {editando ? (
            <Button
              variant="outline-secondary"
              text="Cancelar"
              onClick={props.onCancel}
            />
          ) : null}
        </div>
      </Form>
    </div>
  );
}

export default UserForm;