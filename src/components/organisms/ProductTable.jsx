import { formatearPrecio } from "../../utils/precios";

// Color del stock: agotado en rojo, poco stock en amarillo
function claseStock(stock) {
  if (stock === 0) return "badge bg-danger";
  if (stock <= 3) return "badge bg-warning text-dark";
  return "badge bg-success";
}

function ProductTable(props) {
  if (props.productos.length === 0) {
    return <p className="text-muted">No hay productos registrados.</p>;
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead>
          <tr>
            <th scope="col">Producto</th>
            <th scope="col">Categoría</th>
            <th scope="col">Precio</th>
            <th scope="col">Stock</th>
            <th scope="col">Desc.</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {props.productos.map((producto) => (
            <tr key={producto.id}>
              <td>{producto.nombre}</td>
              <td>{producto.categoria}</td>
              <td>{formatearPrecio(producto.precio)}</td>
              <td>
                <span className={claseStock(producto.stock)}>{producto.stock}</span>
              </td>
              <td>{producto.descuento > 0 ? producto.descuento + "%" : "-"}</td>
              <td>
                <div className="d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    aria-label={"Editar " + producto.nombre}
                    onClick={() => props.onEdit(producto)}
                  >
                    Editar
                  </button>
                  {props.onDelete ? (
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      aria-label={"Desactivar " + producto.nombre}
                      onClick={() => props.onDelete(producto)}
                    >
                      Desactivar
                    </button>
                  ) : null}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;