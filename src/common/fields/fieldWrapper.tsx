import type { FieldWrapperProps } from "../../types/field";

function FieldWrapper({ label, htmlFor, required, errorId, error, children, additionalContent }: FieldWrapperProps) {
  return (
    <div className="space-y-1.5">
      {label && (
      <label htmlFor={htmlFor} className="block text-sm font-medium text-foreground/90">
        {label}
        {required ? <span className="ml-1 text-rose-700" aria-hidden="true">*</span> : null}
      </label>
      )}
      {children}
      {error && (
        <p id={errorId} className="text-xs font-medium text-rose-700" role="alert">
          {error}
        </p>
      )}
      {additionalContent}
    </div>
  );
}

  export default FieldWrapper;