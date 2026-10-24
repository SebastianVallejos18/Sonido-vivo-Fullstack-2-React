import { useState } from "react";
import CategoryNav from "../components/molecules/CategoryNav";
import ProductSection from "../components/organisms/ProductSection";
import ProductFilters from "../components/organisms/ProductFilters";
import categorias from "../data/productos";
import HomePageTemplate from "../components/templates/HomePageTemplate";
import { agregarProducto } from "../services/carritoService";
import { filtrarCategorias } from "../utils/filtros";

const FILTROS_VACIOS = { texto: "", categoria: "", precioMax: "" };

function CatalogPage() {
  const [filtros, setFiltros] = useState(FILTROS_VACIOS);

  const categoriasFiltradas = filtrarCategorias(categorias, filtros);
  const titulos = categorias.map((categoria) => categoria.titulo);

  let totalProductos = 0;
  for (const categoria of categoriasFiltradas) {
    totalProductos = totalProductos + categoria.productos.length;
  }

  function handleClear() {
    setFiltros(FILTROS_VACIOS);
  }

  return (
    <HomePageTemplate
      content={
        <div className="container">
          <CategoryNav categorias={categoriasFiltradas} />

          <ProductFilters
            filters={filtros}
            categories={titulos}
            onChange={setFiltros}
            onClear={handleClear}
          />

          <p className="text-muted" role="status">
            {totalProductos}{" "}
            {totalProductos === 1 ? "producto encontrado" : "productos encontrados"}
          </p>

          {categoriasFiltradas.length === 0 ? (
            <div className="alert alert-info">
              No se encontraron productos con esos filtros.
            </div>
          ) : null}

          {categoriasFiltradas.map((categoria) => (
            <ProductSection
              key={categoria.id}
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