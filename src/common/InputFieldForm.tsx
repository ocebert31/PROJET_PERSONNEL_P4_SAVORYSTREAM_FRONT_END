import { InputFieldProps } from "../types/User";

function InputFieldForm({ label, name, register, errors, id, htmlFor, type = "text" }: InputFieldProps) {
  const Field = type === "textarea" ? "textarea" : "input";

  const inputProps = {
    id,
    ...register(name),
    type: type === "textarea" ? undefined : type,
    className:
      "w-full rounded-2xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted/70 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25",
  };

  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-foreground/90">
        {label}
      </label>
      <Field {...inputProps} />
      {errors?.[name]?.message != null && (
        <p className="text-xs text-rose-600">{errors[name]?.message}</p>
      )}
    </div>
  );
}

export default InputFieldForm;
