import Button from "../atoms/Button";
import FormField from "../molecules/FormField";

function ProductFilters(props) {
  function handleChange(e) {
    props.onChange({
      ...props.filters,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <form
      role="search"
      aria-label="Buscar productos"
      className="card shadow-sm p-3 mb-4"
      onSubmit={handleSubmit}
    >
      <div className="row g-2">
        <div className="col-12 col-md-4">
          <FormField
            id="texto"
            label="Buscar producto"
            placeholder="Ej: guitarra, micrófono..."
            value={props.filters.texto}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>

        <div className="col-12 col-md-4">
          <FormField
            id="categoria"
            label="Categoría"
            type="select"
            placeholder="Todas las categorías"
            options={props.categories}
            value={props.filters.categoria}
            onChange={handleChange}
          />
        </div>

        <div className="col-12 col-md-4">
          <FormField
            id="precioMax"
            label="Precio máximo"
            type="number"
            placeholder="Ej: 150000"
            value={props.filters.precioMax}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
      </div>

      <div>
        <Button variant="outline-secondary" text="Limpiar filtros" onClick={props.onClear} />
      </div>
    </form>
  );
}

export default ProductFilters;