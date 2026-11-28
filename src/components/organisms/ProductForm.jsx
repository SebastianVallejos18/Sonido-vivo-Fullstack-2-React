import { useState } from "react";
import { Form } from "react-bootstrap";
import FormField from "../molecules/FormField";
import Button from "../atoms/Button";
import imagenes from "../../data/imagenes";
import { validarProducto } from "../../utils/validaciones";

function ProductForm(props) {
  const editando = Boolean(props.producto);

  const [formData, setFormData] = useState(
    editando
      ? {
          nombre: props.producto.nombre,
          descripcion: props.producto.descripcion,
          precio: String(props.producto.precio),
          stock: String(props.producto.stock),
          descuento: String(props.producto.descuento),
          categoria: props.producto.categoria,
          imagen: props.producto.imagen,
        }
      : { nombre: "", descripcion: "", precio: "", stock: "", descuento: "0", categoria: "", imagen: imagenes[0] }
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

    const nuevosErrores = validarProducto(formData, props.categorias);
    setErrors(nuevosErrores);

    if (Object.keys(nuevosErrores).length === 0) {
      props.onSubmit(formData);
    }
  }

  return (
    <div className="card shadow-sm p-4">
      <h2 className="h4 mb-3">{editando ? "Editar producto" : "Nuevo producto"}</h2>

      <Form onSubmit={handleSubmit} noValidate>
        <FormField
          id="nombre"
          label="Nombre"
          placeholder="Ej: Ukelele Soprano"
          value={formData.nombre}
          onChange={handleChange}
          autoComplete="off"
          error={errors.nombre}
        />

        <FormField
          id="descripcion"
          label="Descripción"
          type="textarea"
          placeholder="Materiales, características..."
          value={formData.descripcion}
          onChange={handleChange}
        />

        <FormField
          id="categoria"
          label="Categoría"
          type="select"
          placeholder="Selecciona una categoría"
          options={props.categorias}
          value={formData.categoria}
          onChange={handleChange}
          error={errors.categoria}
        />

        <div className="row">
          <div className="col-6">
            <FormField
              id="precio"
              label="Precio ($)"
              type="number"
              placeholder="Ej: 49990"
              value={formData.precio}
              onChange={handleChange}
              error={errors.precio}
            />
          </div>
          <div className="col-6">
            <FormField
              id="stock"
              label="Stock"
              type="number"
              placeholder="Ej: 10"
              value={formData.stock}
              onChange={handleChange}
              error={errors.stock}
            />
          </div>
        </div>

        <FormField
          id="descuento"
          label="Descuento (%)"
          type="number"
          placeholder="0 a 90"
          value={formData.descuento}
          onChange={handleChange}
          error={errors.descuento}
        />

        <FormField
          id="imagen"
          label="Imagen"
          type="select"
          placeholder="Selecciona una imagen"
          options={imagenes}
          value={formData.imagen}
          onChange={handleChange}
        />

        <div className="d-grid gap-2">
          <Button
            type="submit"
            variant="primary"
            text={editando ? "Guardar cambios" : "Crear producto"}
          />
          {editando ? (
            <Button variant="outline-secondary" text="Cancelar" onClick={props.onCancel} />
          ) : null}
        </div>
      </Form>
    </div>
  );
}

export default ProductForm;