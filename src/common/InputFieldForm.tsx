import { InputFieldProps } from "../types/User";

function InputFieldForm({ label, name, register, errors, id, htmlFor, type = "text" }: InputFieldProps) {
  
  const Field = type === "textarea" ? "textarea" : "input"; 

  const inputProps = {
    id,
    ...register(name),
    type: type === "textarea" ? undefined : type,
    className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
  };

  return (
    <div className="space-y-1">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <Field {...inputProps}/>
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name].message}</p>}
    </div>
  );
}

export default InputFieldForm;
