import HomePageTemplate from "../components/templates/HomePageTemplate";
import ProductSection from "../components/organisms/ProductSection";
import categorias from "../data/productos";
import { aplicarOfertas, obtenerOfertas } from "../utils/ofertas";
import { agregarProducto } from "../services/carritoService";

function OffersPage() {
  const ofertas = obtenerOfertas(aplicarOfertas(categorias));

  return (
    <HomePageTemplate
      content={
        <div className="container">
          {ofertas.length === 0 ? (
            <div className="alert alert-info">
              Por ahora no hay productos en oferta.
            </div>
          ) : (
            <ProductSection
              id="ofertas"
              titulo="Ofertas"
              productos={ofertas}
              onAdd={agregarProducto}
            />
          )}
        </div>
      }
    />
  );
}

export default OffersPage;