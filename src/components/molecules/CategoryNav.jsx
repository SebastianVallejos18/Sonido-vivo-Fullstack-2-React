function CategoryNav(props) {
  return (
    <nav className="d-flex flex-wrap justify-content-center gap-3 bg-white rounded shadow-sm p-3 mb-4">
      {props.categorias.map((categoria) => (
        <a
          key={categoria.id}
          href={"#" + categoria.id}
          className="text-decoration-none fw-semibold"
        >
          {categoria.titulo}
        </a>
      ))}
    </nav>
  );
}

export default CategoryNav;