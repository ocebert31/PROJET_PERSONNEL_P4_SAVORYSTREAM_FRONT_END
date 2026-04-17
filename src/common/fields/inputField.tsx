import { useState } from "react";
import type { FieldValues } from "react-hook-form";
import type { InputFieldProps } from "../../types/field";
import PasswordVisibilityToggle from "../../common/fields/passwordVisibilityToggle";

function InputField<TFieldValues extends FieldValues>({ id, type, register, name, disabled, min, step, accept, valueAsNumber,
  required, autoComplete, inputMode, ariaDescribedBy, ariaInvalid }: InputFieldProps<TFieldValues>) {
  // Detect whether this input should render password-specific UI.
  const isPasswordField = type === "password";
  const [showPassword, setShowPassword] = useState(false);
  // Switch to plain text when the user toggles password visibility.
  const inputType = isPasswordField && showPassword ? "text" : type;
  const baseClass = `w-full rounded-2xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted/70 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25${isPasswordField ? " pr-12" : ""}`;
  
  // Build the registration props used by react-hook-form for this field.
  const fieldRegistrationProps =
    type === "number" && valueAsNumber
      ? register(name, { valueAsNumber: true })
      : register(name);

  return (
    <div className={isPasswordField ? "relative" : undefined}>
      <input id={id} type={inputType} disabled={disabled} min={min} step={step} accept={accept} required={required}
      autoComplete={autoComplete} inputMode={inputMode} aria-describedby={ariaDescribedBy} aria-invalid={ariaInvalid || undefined} className={baseClass} {...fieldRegistrationProps}/>
      {isPasswordField ? (
        <PasswordVisibilityToggle isVisible={showPassword} onToggle={() => setShowPassword((prev) => !prev)} />
      ) : null}
    </div>
  );
}

export default InputField;