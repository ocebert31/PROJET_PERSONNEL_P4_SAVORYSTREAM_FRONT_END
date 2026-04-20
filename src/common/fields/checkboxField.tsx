import { InputFieldProps } from "@/types/field";
import { FieldValues } from "react-hook-form";

function CheckboxField<TFieldValues extends FieldValues>({ id, register, name, label, htmlFor, ariaDescribedBy, ariaInvalid }: InputFieldProps<TFieldValues>): React.ReactNode {
  return (
    <div className="ds-input-radius flex items-center gap-3 border border-border bg-background px-4 py-3">
      <input id={id} type="checkbox" aria-describedby={ariaDescribedBy} aria-invalid={ariaInvalid || undefined} className="h-4 w-4 rounded border-border text-primary focus:ring-primary/30"
        {...register(name)}/>
      <label htmlFor={htmlFor} className="text-label">
        {label}
      </label>
    </div>
  );
}

export default CheckboxField;
