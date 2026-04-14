import type { FieldWrapperProps } from "../../types/Field";

function FieldWrapper({ label, htmlFor, error, children, additionalContent }: FieldWrapperProps) {
    return (
        <div className="space-y-1.5">
            {label && (
            <label htmlFor={htmlFor} className="block text-sm font-medium text-foreground/90">
                {label}
            </label>
            )}
            {children}
            {error && <p className="text-xs text-rose-600">{error}</p>}
            {additionalContent}
        </div>
    );
}

  export default FieldWrapper;