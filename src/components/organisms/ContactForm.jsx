import { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import FormField from "../molecules/FormField";
import Button from "../atoms/Button";

const patronCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ContactForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    mensaje: "",
  });

  const [errors, setErrors] = useState({
    nombre: "",
    correo: "",
    mensaje: "",
  });

  const [touched, setTouched] = useState({
    nombre: false,
    correo: false,
    mensaje: false,
  });

  const [aviso, setAviso] = useState({ texto: "", tipo: "" });

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
    const nuevosErrores = { nombre: "", correo: "", mensaje: "" };

    setTouched({ nombre: true, correo: true, mensaje: true });

    if (formData.nombre.trim() === "") {
      nuevosErrores.nombre = "Por favor ingresa tu nombre.";
      esValido = false;
    }

    if (!patronCorreo.test(formData.correo.trim())) {
      nuevosErrores.correo = "Ingresa un correo válido, ej: nombre@dominio.com";
      esValido = false;
    }

    if (formData.mensaje.trim().length < 10) {
      nuevosErrores.mensaje = "Tu mensaje debe tener al menos 10 caracteres.";
      esValido = false;
    }

    setErrors(nuevosErrores);

    if (esValido) {
      setAviso({
        texto: "¡Mensaje enviado correctamente!",
        tipo: "success",
      });
    } else {
      setAviso({
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
            <h2 className="text-center mb-3">Contacto</h2>
            <p className="text-center">
              ¿Tienes dudas sobre algún producto o pedido? Escríbenos y te
              respondemos a la brevedad.
            </p>

            <Form onSubmit={handleSubmit} noValidate>
              <FormField
                id="nombre"
                label="Nombre completo"
                placeholder="Ej: Juan Pérez"
                value={formData.nombre}
                onChange={handleChange}
                autoComplete="name"
                error={errors.nombre}
                isVerified={
                  touched.nombre &&
                  !errors.nombre &&
                  formData.nombre.trim() !== ""
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
                id="mensaje"
                label="Mensaje"
                type="textarea"
                placeholder="Escribe tu consulta aquí..."
                value={formData.mensaje}
                onChange={handleChange}
                error={errors.mensaje}
                isVerified={
                  touched.mensaje &&
                  !errors.mensaje &&
                  formData.mensaje.trim().length >= 10
                }
              />

              <div className="d-grid gap-2 mb-3">
                <Button type="submit" variant="primary" text="Enviar mensaje" />
              </div>

              {aviso.texto ? (
                <div className={`alert alert-${aviso.tipo} mt-3`} role="alert">
                  {aviso.texto}
                </div>
              ) : null}
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default ContactForm;