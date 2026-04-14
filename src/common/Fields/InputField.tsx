import type { FieldValues } from "react-hook-form";
import type { InputFieldProps } from "../../types/Field";

function InputField<TFieldValues extends FieldValues>({ id, type, register, name, disabled, min, step, accept, valueAsNumber }: InputFieldProps<TFieldValues>) {
  const baseClass = "w-full rounded-2xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted/70 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25";
  
  const registration =
    type === "number" && valueAsNumber
      ? register(name, { valueAsNumber: true })
      : register(name);

  return (
    <input id={id} type={type} disabled={disabled} min={min} step={step} accept={accept} className={baseClass} {...registration}/>
  );
}

export default InputField;