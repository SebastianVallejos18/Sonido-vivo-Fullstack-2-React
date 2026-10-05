import ProductCard from "../molecules/ProductCard";

function ProductSection(props) {
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
              description={producto.descripcion}
              showButton={true}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProductSection;