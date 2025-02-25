import { InputFieldProps } from "../../types/User";

function PasswordField ({ label, name, register, error, htmlFor, id, 'data-testid': dataTestId }: InputFieldProps) {
  return (
    <div>
      <label htmlFor={htmlFor}>{label}</label>
      <input id={id} type="password" {...register(name)} data-testid={dataTestId}/>
      {error && <p>{error}</p>}
    </div>
  );
};

export default PasswordField;
