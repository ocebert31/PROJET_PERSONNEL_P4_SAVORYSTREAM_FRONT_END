import type { FieldWrapperProps } from "../../types/field";

function FieldWrapper({ label, htmlFor, required, errorId, error, children, additionalContent }: FieldWrapperProps) {
  return (
    <div className="space-y-1.5">
      {label && (
      <label htmlFor={htmlFor} className="text-label block">
        {label}
        {required ? <span className="ml-1 text-destructive" aria-hidden="true">*</span> : null}
      </label>
      )}
      {children}
      {error && (
        <p id={errorId} className="text-caption font-medium text-destructive" role="alert">
          {error}
        </p>
      )}
      {additionalContent}
    </div>
  );
}

export default FieldWrapper;
