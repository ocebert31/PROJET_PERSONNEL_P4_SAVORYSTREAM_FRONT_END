import { InputFieldProps } from "@/types/Field";
import { FieldValues } from "react-hook-form";

function CheckboxField<TFieldValues extends FieldValues>({ id, register, name, label, htmlFor }: InputFieldProps<TFieldValues>) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3">
        <input id={id} type="checkbox" className="h-4 w-4 rounded border-border text-primary focus:ring-primary/30" {...register(name)}/>
        <label htmlFor={htmlFor} className="text-sm font-medium text-foreground/90">
          {label}
        </label>
      </div>
    );
}

export default CheckboxField;