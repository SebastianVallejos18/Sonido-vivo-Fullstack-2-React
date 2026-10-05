import { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import FormField from "../molecules/FormField";
import Button from "../atoms/Button";

const patronCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const patronTelefono = /^(\+?56)?9\d{8}$/;

function RegisterForm() {
  const [formData, setFormData] = useState({
    nombreUsuario: "",
    correo: "",
    telefono: "",
  });

  const [errors, setErrors] = useState({
    nombreUsuario: "",
    correo: "",
    telefono: "",
  });

  const [touched, setTouched] = useState({
    nombreUsuario: false,
    correo: false,
    telefono: false,
  });

  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });

  function handleChange(e) {
    const nombre = e.target.name;
    const valor = e.target.value;

    setFormData({
      ...formData,
      [nombre]: valor,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    let esValido = true;
    const nuevosErrores = { nombreUsuario: "", correo: "", telefono: "" };
    const telefonoLimpio = formData.telefono.trim().replaceAll(" ", "");

    setTouched({ nombreUsuario: true, correo: true, telefono: true });

    if (formData.nombreUsuario.trim() === "") {
      nuevosErrores.nombreUsuario = "Por favor ingresa tu nombre de usuario.";
      esValido = false;
    }

    if (!patronCorreo.test(formData.correo.trim())) {
      nuevosErrores.correo = "Ingresa un correo válido, ej: nombre@dominio.com";
      esValido = false;
    }

    if (!patronTelefono.test(telefonoLimpio)) {
      nuevosErrores.telefono = "Ingresa un número chileno válido, ej: +56912345678";
      esValido = false;
    }

    setErrors(nuevosErrores);

    if (esValido) {
      setMensaje({
        texto: "¡Formulario enviado correctamente!",
        tipo: "success",
      });
    } else {
      setMensaje({
        texto: "Por favor, corrige los campos marcados en rojo.",
        tipo: "danger",
      });
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
                isVerified={
                  touched.nombreUsuario &&
                  !errors.nombreUsuario &&
                  formData.nombreUsuario.trim() !== ""
                }
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
                isVerified={
                  touched.correo &&
                  !errors.correo &&
                  patronCorreo.test(formData.correo.trim())
                }
              />

              <FormField
                id="telefono"
                label="Número de teléfono"
                type="tel"
                placeholder="+56912345678"
                value={formData.telefono}
                onChange={handleChange}
                autoComplete="tel"
                error={errors.telefono}
                isVerified={
                  touched.telefono &&
                  !errors.telefono &&
                  patronTelefono.test(formData.telefono.trim().replaceAll(" ", ""))
                }
              />

              <div className="d-grid gap-2 mb-3">
                <Button type="submit" variant="primary" text="Registrar" />
              </div>

              {mensaje.texto ? (
                <div className={`alert alert-${mensaje.tipo} mt-3`} role="alert">
                  {mensaje.texto}
                </div>
              ) : null}
            </Form>

            <p className="text-center mt-3 mb-0">
              ¿Ya tienes una cuenta?{" "}
              <a href="login.html" className="text-decoration-none">
                Inicia sesión aquí
              </a>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default RegisterForm;