import { useEffect, useState } from "react";
import HomePageTemplate from "../components/templates/HomePageTemplate";
import ProductTable from "../components/organisms/ProductTable";
import ProductForm from "../components/organisms/ProductForm";
import {
  obtenerProductos,
  obtenerCategorias,
  crearProducto,
  actualizarProducto,
  desactivarProducto,
} from "../services/productosService";
import { obtenerMensajeError, obtenerSesion, tieneRol } from "../services/authService";

// Gestión del catálogo: ADMIN y VENDEDOR crean y editan (incluido el stock);
// solo ADMIN desactiva. El backend aplica las mismas reglas.
function ProductsAdminPage() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState(null);
  const [versionFormulario, setVersionFormulario] = useState(0);
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");

  const esAdmin = tieneRol(obtenerSesion(), "ADMIN");

  // Al entrar se piden productos y categorías a la API al mismo tiempo
  useEffect(() => {
    Promise.all([obtenerProductos(), obtenerCategorias()])
      .then(([listaProductos, listaCategorias]) => {
        setProductos(listaProductos);
        setCategorias(listaCategorias);
      })
      .catch((e) => setError(obtenerMensajeError(e)))
      .finally(() => setCargando(false));
  }, []);

  async function recargarProductos() {
    const lista = await obtenerProductos();
    setProductos(lista);
  }

  async function handleSubmit(datos) {
    try {
      if (editando) {
        await actualizarProducto(editando.id, datos, categorias);
        setAviso("Producto actualizado correctamente.");
      } else {
        await crearProducto(datos, categorias);
        setAviso("Producto creado correctamente.");
      }

      await recargarProductos();
      setEditando(null);
      setVersionFormulario(versionFormulario + 1);
      setError("");
    } catch (e) {
      setError(obtenerMensajeError(e));
      setAviso("");
    }
  }

  function handleEdit(producto) {
    setEditando(producto);
    setError("");
    setAviso("");
  }

  function handleCancel() {
    setEditando(null);
    setError("");
  }

  async function handleDelete(producto) {
    try {
      await desactivarProducto(producto.id);
      await recargarProductos();
      setAviso("Producto desactivado: ya no aparece en el catálogo.");
      setError("");
    } catch (e) {
      setError(obtenerMensajeError(e));
      setAviso("");
    }
  }

  const claveFormulario = (editando ? editando.id : "nuevo") + "-" + versionFormulario;
  const titulosCategorias = categorias.map((categoria) => categoria.titulo);

  return (
    <HomePageTemplate
      content={
        <div className="container my-4">
          <h2 className="mb-1">Inventario</h2>
          <p className="text-muted mb-4">
            Crea productos, edita sus datos y actualiza el stock.
          </p>

          {error ? (
            <div className="alert alert-danger" role="alert">{error}</div>
          ) : null}

          {aviso ? (
            <div className="alert alert-success" role="status">{aviso}</div>
          ) : null}

          {cargando ? (
            <p className="text-muted">Cargando productos...</p>
          ) : (
            <div className="row g-4">
              <div className="col-12 col-lg-4">
                <ProductForm
                  key={claveFormulario}
                  producto={editando}
                  categorias={titulosCategorias}
                  onSubmit={handleSubmit}
                  onCancel={handleCancel}
                />
              </div>

              <div className="col-12 col-lg-8">
                <h2 className="h4 mb-3">Productos ({productos.length})</h2>
                <ProductTable
                  productos={productos}
                  onEdit={handleEdit}
                  onDelete={esAdmin ? handleDelete : null}
                />
              </div>
            </div>
          )}
        </div>
      }
    />
  );
}

export default ProductsAdminPage;