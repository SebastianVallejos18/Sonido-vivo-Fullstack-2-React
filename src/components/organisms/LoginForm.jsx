import { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FormField from "../molecules/FormField";
import Button from "../atoms/Button";
import { iniciarSesion, obtenerMensajeError } from "../../services/authService";

const patronCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function LoginForm() {
  const navigate = useNavigate();
  const ubicacion = useLocation();
  const [formData, setFormData] = useState({ correo: "", password: "" });
  const [errors, setErrors] = useState({ correo: "", password: "" });
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (cargando) return;

    const nuevosErrores = { correo: "", password: "" };
    if (!patronCorreo.test(formData.correo.trim())) {
      nuevosErrores.correo = "Ingresa un correo valido, ej: nombre@dominio.com";
    }
    if (formData.password === "") {
      nuevosErrores.password = "La contraseña no puede estar vacia";
    }
    setErrors(nuevosErrores);

    if (nuevosErrores.correo || nuevosErrores.password) {
      setMensaje({ texto: "Por favor, corrige los campos marcados en rojo.", tipo: "danger" });
      return;
    }

    setCargando(true);
    setMensaje({ texto: "", tipo: "" });
    try {
      const datos = await iniciarSesion(formData);
      setMensaje({ texto: "¡Bienvenido, " + datos.usuario.nombre + "!", tipo: "success" });
      navigate(ubicacion.state?.desde || "/");
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
            <h2 className="text-center mb-4">Inicio de sesión</h2>

            <Form onSubmit={handleSubmit} noValidate>
              <FormField
                id="correo"
                label="Correo electrónico"
                type="email"
                placeholder="ejemplo@gmail.com"
                value={formData.correo}
                onChange={handleChange}
                autoComplete="email"
                error={errors.correo}
              />

              <FormField
                id="password"
                label="Contraseña"
                type="password"
                placeholder="Tu contraseña"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                error={errors.password}
              />

              <div className="d-grid gap-2 mb-3">
                <Button
                  type="submit"
                  variant="primary"
                  text={cargando ? "Ingresando..." : "Iniciar sesión"}
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
              ¿Aún no tienes una cuenta?{" "}
              <Link to="/register" className="text-decoration-none">
                ¡Registrate aqui!
              </Link>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginForm;