import { Link, useParams } from "react-router-dom";
import HomePageTemplate from "../components/templates/HomePageTemplate";
import ProductDetail from "../components/organisms/ProductDetail";
import categorias from "../data/productos";
import { aplicarOfertas } from "../utils/ofertas";
import { buscarProducto } from "../utils/productos";
import { agregarProducto } from "../services/carritoService";

function ProductDetailPage() {
  const params = useParams();
  const producto = buscarProducto(aplicarOfertas(categorias), params.slug);

  let contenido;

  if (producto) {
    contenido = (
      <ProductDetail product={producto} onAdd={() => agregarProducto(producto)} />
    );
  } else {
    contenido = (
      <section className="container text-center my-5">
        <h2 className="mb-3">Producto no encontrado</h2>
        <p className="mb-4">El producto que buscas no existe o ya no está disponible.</p>
        <Link to="/catalogo" className="btn btn-primary">
          Ver productos
        </Link>
      </section>
    );
  }

  return <HomePageTemplate content={contenido} />;
}

export default ProductDetailPage;