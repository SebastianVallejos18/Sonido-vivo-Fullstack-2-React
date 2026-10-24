import CategoryNav from "../components/molecules/CategoryNav";
import ProductSection from "../components/organisms/ProductSection";
import categorias from "../data/productos";
import HomePageTemplate from "../components/templates/HomePageTemplate";
import { agregarProducto } from "../services/carritoService";


function CatalogPage() {
  return (
    <HomePageTemplate
      content={
        <div className="container">
          <CategoryNav categorias={categorias} />
          {categorias.map((categoria) => (
            <ProductSection
              id={categoria.id}
              titulo={categoria.titulo}
              productos={categoria.productos}
              onAdd={agregarProducto}
            />
          ))}
        </div>
      }
    />
  );
}

export default CatalogPage;