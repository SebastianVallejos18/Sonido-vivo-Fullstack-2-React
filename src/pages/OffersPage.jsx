import { useEffect, useState } from "react";
import HomePageTemplate from "../components/templates/HomePageTemplate";
import ProductSection from "../components/organisms/ProductSection";
import { aplicarOfertas, obtenerOfertas } from "../utils/ofertas";
import { agregarProducto } from "../services/carritoService";
import { obtenerCatalogo } from "../services/productosService";
import { obtenerMensajeError } from "../services/authService";

function OffersPage() {
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerCatalogo()
      .then((lista) => setCategorias(lista))
      .catch((e) => setError(obtenerMensajeError(e)))
      .finally(() => setCargando(false));
  }, []);

  const ofertas = obtenerOfertas(aplicarOfertas(categorias));

  let contenido;
  if (error) {
    contenido = <div className="alert alert-danger" role="alert">{error}</div>;
  } else if (cargando) {
    contenido = <p className="text-muted my-4">Cargando ofertas...</p>;
  } else if (ofertas.length === 0) {
    contenido = <div className="alert alert-info">Por ahora no hay productos en oferta.</div>;
  } else {
    contenido = (
      <ProductSection id="ofertas" titulo="Ofertas" productos={ofertas} onAdd={agregarProducto} />
    );
  }

  return (
    <HomePageTemplate
      content={
        <div className="container">
          {contenido}
        </div>
      }
    />
  );
}

export default OffersPage;