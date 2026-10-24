function Select(props) {
  const clasesSelect = `form-select ${
    props.hasError ? "is-invalid" : props.isVerified ? "is-valid" : ""
  }`;

  return (
    <select
      id={props.id}
      name={props.name}
      value={props.value}
      onChange={props.onChange}
      className={clasesSelect.trim()}
    >
      <option value="">{props.placeholder || "Selecciona una opción"}</option>
      {props.options.map((opcion) => (
        <option key={opcion} value={opcion}>
          {opcion}
        </option>
      ))}
    </select>
  );
}

export default Select;