import Label from "../atoms/Label";
import Input from "../atoms/Input";
import TextArea from "../atoms/TextArea";

function FormField(props) {
  const tipo = props.type || "text";
  const tieneError = Boolean(props.error);

  return (
    <div className="mb-3">
      <Label text={props.label} htmlFor={props.id} />

      {tipo === "textarea" ? (
        <TextArea
          id={props.id}
          name={props.id}
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.onChange}
          hasError={tieneError}
          isVerified={props.isVerified}
        />
      ) : (
        <Input
          id={props.id}
          name={props.id}
          type={tipo}
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.onChange}
          autoComplete={props.autoComplete}
          hasError={tieneError}
          isVerified={props.isVerified}
        />
      )}

      {props.error ? (
        <div className="invalid-feedback d-block">
          {props.error}
        </div>
      ) : null}
    </div>
  );
}

export default FormField;