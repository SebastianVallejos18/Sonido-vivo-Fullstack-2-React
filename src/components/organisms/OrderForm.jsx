import { useState } from "react";
import { Form } from "react-bootstrap";
import FormField from "../molecules/FormField";
import Button from "../atoms/Button";
import { validarPedido } from "../../utils/validaciones";

function OrderForm(props) {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    metodo: "despacho",
    direccion: "",
  });

  const [errors, setErrors] = useState({});
  const [enviado, setEnviado] = useState(false);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const nuevosErrores = validarPedido(formData);
    setErrors(nuevosErrores);
    setEnviado(true);

    if (Object.keys(nuevosErrores).length === 0) {
      props.onSubmit(formData);
    }
  }

  return (
    <div className="card shadow-sm p-4">
      <h2 className="h4 mb-3">Datos del pedido</h2>

      <Form onSubmit={handleSubmit} noValidate>
        <FormField
          id="nombre"
          label="Nombre completo"
          placeholder="Ej: Juan Pérez"
          value={formData.nombre}
          onChange={handleChange}
          autoComplete="name"
          error={errors.nombre}
          isVerified={enviado && !errors.nombre}
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
          isVerified={enviado && !errors.correo}
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
          isVerified={enviado && !errors.telefono}
        />

        <fieldset className="mb-3">
          <legend className="form-label fs-6">Método de entrega</legend>

          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              id="metodo-despacho"
              name="metodo"
              value="despacho"
              checked={formData.metodo === "despacho"}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="metodo-despacho">
              Despacho a domicilio
            </label>
          </div>

          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              id="metodo-retiro"
              name="metodo"
              value="retiro"
              checked={formData.metodo === "retiro"}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="metodo-retiro">
              Retiro en tienda
            </label>
          </div>
        </fieldset>

        {formData.metodo === "despacho" ? (
          <FormField
            id="direccion"
            label="Dirección de despacho"
            placeholder="Ej: Av. Libertad 123, Viña del Mar"
            value={formData.direccion}
            onChange={handleChange}
            autoComplete="street-address"
            error={errors.direccion}
            isVerified={enviado && !errors.direccion}
          />
        ) : null}

        <div className="d-grid">
          <Button type="submit" variant="success" text="Confirmar pedido" />
        </div>
      </Form>
    </div>
  );
}

export default OrderForm;