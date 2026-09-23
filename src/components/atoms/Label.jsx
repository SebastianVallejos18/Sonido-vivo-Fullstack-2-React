function Label(props) {
  return (
    <label className="form-label" htmlFor={props.htmlFor}>
      {props.text}
    </label>
  );
}

export default Label;