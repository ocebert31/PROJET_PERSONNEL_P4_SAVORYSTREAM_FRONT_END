import { InputFieldProps } from "@/types/Field";
import { FieldValues } from "react-hook-form";

function SelectField<TFieldValues extends FieldValues>({ id, register, name, disabled, options = [], placeholderOption }: InputFieldProps<TFieldValues>) {
    const baseClass = "w-full rounded-2xl border border-border bg-background px-4 py-3 text-foreground transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25";
  
    return (
      <select id={id} disabled={disabled} className={baseClass} {...register(name)}>
        {placeholderOption && (
          <option value={placeholderOption.value}>{placeholderOption.label}</option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
}

export default SelectField;