import { useState } from "react";
import { Link } from "react-router-dom";
import Image from "../atoms/Image";
import Title from "../atoms/Title";
import Button from "../atoms/Button";

function ProductDetail(props) {
  const [agregado, setAgregado] = useState(false);

  function handleAgregar() {
    setAgregado(true);
    if (props.onAdd) {
      props.onAdd();
    }
  }

  return (
    <section className="container my-4">
      <Link to="/catalogo" className="d-inline-block mb-3">
        Volver al catálogo
      </Link>

      <div className="row g-4 align-items-center">
        <div className="col-12 col-md-6">
          <Image
            src={props.product.imagen}
            alt={props.product.nombre}
            className="img-fluid rounded"
          />
        </div>

        <div className="col-12 col-md-6">
          <p className="text-muted mb-1">{props.product.categoria}</p>
          <Title level="h2" className="mb-3" text={props.product.nombre} />
          <p className="h3 mb-1">{props.product.precio}</p>

          {props.product.precioOriginal ? (
            <p className="mb-3">
              <s className="text-muted">{props.product.precioOriginal}</s>{" "}
              <span className="badge bg-danger">-{props.product.descuento}%</span>
            </p>
          ) : null}

          <p className="mb-4">{props.product.descripcion}</p>

          <Button variant="primary" text="Agregar al carrito" onClick={handleAgregar} />
          {agregado ? (
            <p className="text-success mt-2 mb-0">¡Producto agregado!</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default ProductDetail;