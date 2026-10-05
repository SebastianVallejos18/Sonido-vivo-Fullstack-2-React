function TextArea(props) {
  let clase = "form-control";

  if (props.hasError) {
    clase = clase + " is-invalid";
  } else if (props.isVerified) {
    clase = clase + " is-valid";
  }

  return (
    <textarea
      id={props.id}
      name={props.name}
      className={clase}
      rows={4}
      placeholder={props.placeholder}
      value={props.value}
      onChange={props.onChange}
    />
  );
}

export default TextArea;