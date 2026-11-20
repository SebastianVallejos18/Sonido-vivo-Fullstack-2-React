import { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import FormField from "../molecules/FormField";
import Button from "../atoms/Button";
import { registrarUsuario, obtenerMensajeError } from "../../services/authService";

const patronCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FORMULARIO_VACIO = { nombreUsuario: "", correo: "", password: "" };

function RegisterForm() {
  const [formData, setFormData] = useState(FORMULARIO_VACIO);
  const [errors, setErrors] = useState(FORMULARIO_VACIO);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (cargando) return;

    const nuevosErrores = { ...FORMULARIO_VACIO };
    if (formData.nombreUsuario.trim() === "") {
      nuevosErrores.nombreUsuario = "Por favor ingresa tu nombre de usuario.";
    }
    if (!patronCorreo.test(formData.correo.trim())) {
      nuevosErrores.correo = "Ingresa un correo válido, ej: nombre@dominio.com";
    }
    if (formData.password.length < 8) {
      nuevosErrores.password = "La contraseña debe tener al menos 8 caracteres.";
    }
    setErrors(nuevosErrores);

    if (nuevosErrores.nombreUsuario || nuevosErrores.correo || nuevosErrores.password) {
      setMensaje({ texto: "Por favor, corrige los campos marcados en rojo.", tipo: "danger" });
      return;
    }

    setCargando(true);
    setMensaje({ texto: "", tipo: "" });
    try {
      // DTO de entrada: nombreUsuario del formulario es "nombre" para la API.
      await registrarUsuario({
        nombre: formData.nombreUsuario,
        correo: formData.correo,
        password: formData.password,
      });
      setMensaje({ texto: "¡Cuenta creada! Ya puedes iniciar sesión.", tipo: "success" });
      setFormData(FORMULARIO_VACIO);
    } catch (error) {
      setMensaje({ texto: obtenerMensajeError(error), tipo: "danger" });
    } finally {
      setCargando(false);
    }
  }

  return (
    <Container className="my-4">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6} xl={5}>
          <div className="card shadow-sm p-4">
            <h2 className="text-center mb-4">Registrarse</h2>

            <Form onSubmit={handleSubmit} noValidate>
              <FormField
                id="nombreUsuario"
                label="Nombre de usuario"
                placeholder="Ej: Juan Perez"
                value={formData.nombreUsuario}
                onChange={handleChange}
                autoComplete="username"
                error={errors.nombreUsuario}
              />

              <FormField
                id="correo"
                label="Correo electrónico"
                type="email"
                placeholder="ejemplo@correo.com"
                value={formData.correo}
                onChange={handleChange}
                autoComplete="email"
                error={errors.correo}
              />

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

              <div className="d-grid gap-2 mb-3">
                <Button
                  type="submit"
                  variant="primary"
                  text={cargando ? "Registrando..." : "Registrar"}
                  disabled={cargando}
                />
              </div>

              {mensaje.texto ? (
                <div className={"alert alert-" + mensaje.tipo + " mt-3"} role="alert">
                  {mensaje.texto}
                </div>
              ) : null}
            </Form>

            <p className="text-center mt-3 mb-0">
              ¿Ya tienes una cuenta?{" "}
              <Link to="/login" className="text-decoration-none">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default RegisterForm;