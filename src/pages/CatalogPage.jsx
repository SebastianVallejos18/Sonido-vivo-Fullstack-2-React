import { useEffect, useState } from "react";
import CategoryNav from "../components/molecules/CategoryNav";
import ProductSection from "../components/organisms/ProductSection";
import ProductFilters from "../components/organisms/ProductFilters";
import HomePageTemplate from "../components/templates/HomePageTemplate";
import { agregarProducto } from "../services/carritoService";
import { filtrarCategorias } from "../utils/filtros";
import { aplicarOfertas } from "../utils/ofertas";
import { obtenerCatalogo } from "../services/productosService";
import { obtenerMensajeError } from "../services/authService";


const FILTROS_VACIOS = { texto: "", categoria: "", precioMax: "" };

function CatalogPage() {
  const [filtros, setFiltros] = useState(FILTROS_VACIOS);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Al entrar se pide el catálogo a la API
  useEffect(() => {
    obtenerCatalogo()
      .then((lista) => setCategorias(lista))
      .catch((e) => setError(obtenerMensajeError(e)))
      .finally(() => setCargando(false));
  }, []);

  if (cargando || error) {
    return (
      <HomePageTemplate
        content={
          <div className="container my-4">
            {error ? (
              <div className="alert alert-danger" role="alert">{error}</div>
            ) : (
              <p className="text-muted">Cargando catálogo...</p>
            )}
          </div>
        }
      />
    );
  }

  const categoriasConOfertas = aplicarOfertas(categorias);
  const categoriasFiltradas = filtrarCategorias(categoriasConOfertas, filtros);
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