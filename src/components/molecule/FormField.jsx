import Label from "../atom/Label";
import Input from "../atom/Input";

function FormField(props) {
  const tipo = props.type || "text";
  const tieneError = Boolean(props.error);

  return (
    <div className="mb-3">
      <label className="form-label d-block">
        <Label text={props.label} />
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
      </label>

      {props.error ? (
        <div className="invalid-feedback d-block">
          {props.error}
        </div>
      ) : null}
    </div>
  );
}

export default FormField;