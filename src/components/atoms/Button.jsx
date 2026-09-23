function Button(props) {
  const tipo = props.type || "button";
  const variante = props.variant || "primary";

  return (
    <button 
      type={tipo} 
      className={`btn btn-${variante}`} 
      onClick={props.onClick}
    >
      {props.text}
    </button>
  );
}

export default Button;