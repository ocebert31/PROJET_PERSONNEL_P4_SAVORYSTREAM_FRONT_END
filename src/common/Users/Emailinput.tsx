import { InputFieldProps } from "../../types/User";

function InputField({ label, name, register, error, id, htmlFor }: InputFieldProps) {
  return (
    <div className="space-y-1">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">{label}</label>
      <input id={id} {...register(name)} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"/>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default InputField;
