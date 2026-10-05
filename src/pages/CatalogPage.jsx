import HomePageTemplate from "../components/templates/HomePageTemplate";
import CategoryNav from "../components/molecules/CategoryNav";
import ProductSection from "../components/organisms/ProductSection";
import categorias from "../data/productos";

function CatalogPage() {
  return (
    <HomePageTemplate
      content={
        <div className="container">
          <CategoryNav categorias={categorias} />

          {categorias.map((categoria) => (
            <ProductSection
              key={categoria.id}
              id={categoria.id}
              titulo={categoria.titulo}
              productos={categoria.productos}
            />
          ))}
        </div>
      }
    />
  );
}

export default CatalogPage;