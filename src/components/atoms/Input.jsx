function Input(props) {
  const tipo = props.type || "text";
  
  const clasesInput = `form-control ${
    props.hasError ? "is-invalid" : props.isVerified ? "is-valid" : ""
  }`;

  return (
    <input
      id={props.id}
      name={props.name}
      type={tipo}
      placeholder={props.placeholder}
      value={props.value}
      onChange={props.onChange}
      autoComplete={props.autoComplete}
      className={clasesInput.trim()}
    />
  );
}

export default Input;