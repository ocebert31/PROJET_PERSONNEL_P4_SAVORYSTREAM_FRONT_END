import { InputFieldProps } from "../../types/User";

function InputField ({ label, name, register, error, id, htmlFor } : InputFieldProps) {
  return (
    <div>
      <label htmlFor={htmlFor}>{label}</label>
      <input id={id} {...register(name)}/>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default InputField;
