import ProductCard from "../molecules/ProductCard";
import { crearSlug } from "../../utils/productos";

function ProductSection(props) {
  function handleAdd(producto) {
    if (props.onAdd) {
      props.onAdd(producto);
    }
  }

  return (
    <section id={props.id} className="mb-5">
      <h2 className="mb-4">{props.titulo}</h2>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {props.productos.map((producto) => (
          <div className="col" key={producto.nombre}>
            <ProductCard
              image={producto.imagen}
              alt={producto.nombre}
              text={producto.nombre}
              price={producto.precio}
              oldPrice={producto.precioOriginal}
              discount={producto.descuento}
              description={producto.descripcion}
              detailTo={"/producto/" + crearSlug(producto.nombre)}
              showButton={true}
              onAdd={() => handleAdd(producto)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProductSection;