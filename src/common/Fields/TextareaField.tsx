import type { FieldValues } from "react-hook-form";
import type { InputFieldProps } from "../../types/Field";

function TextareaField<TFieldValues extends FieldValues>({ id, register, name, disabled,
  required, ariaDescribedBy, ariaInvalid }: InputFieldProps<TFieldValues>) {
    const baseClass = "w-full rounded-2xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted/70 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25";
    return (
      <textarea id={id} disabled={disabled} required={required} aria-describedby={ariaDescribedBy} 
      aria-invalid={ariaInvalid || undefined} className={baseClass} {...register(name)} />
    );
}

export default TextareaField