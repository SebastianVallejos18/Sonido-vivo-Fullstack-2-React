import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import HomePageTemplate from "../components/templates/HomePageTemplate";
import ProductDetail from "../components/organisms/ProductDetail";
import { aplicarOfertas } from "../utils/ofertas";
import { buscarProducto } from "../utils/productos";
import { agregarProducto } from "../services/carritoService";
import { obtenerCatalogo } from "../services/productosService";
import { obtenerMensajeError } from "../services/authService";

function ProductDetailPage() {
  const params = useParams();
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerCatalogo()
      .then((lista) => setCategorias(lista))
      .catch((e) => setError(obtenerMensajeError(e)))
      .finally(() => setCargando(false));
  }, []);

  const producto = buscarProducto(aplicarOfertas(categorias), params.slug);

  let contenido;

  if (error) {
    contenido = (
      <div className="container my-4">
        <div className="alert alert-danger" role="alert">{error}</div>
      </div>
    );
  } else if (cargando) {
    contenido = <p className="container text-muted my-4">Cargando producto...</p>;
  } else if (producto) {
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