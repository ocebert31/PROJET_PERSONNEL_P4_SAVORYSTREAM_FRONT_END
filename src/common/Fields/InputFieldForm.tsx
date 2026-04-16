import type { FieldValues, Path } from "react-hook-form";
import type { InputFieldProps } from "../../types/Field";
import InputField from "./InputField";
import FieldWrapper from "./FieldWrapper";
import TextareaField from "./TextareaField";
import SelectField from "./SelectField";
import CheckboxField from "./CheckboxField";

export function getNestedValue(source: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, segment) => {
    if (acc && typeof acc === "object" && segment in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[segment];
    }
    return undefined;
  }, source);
}

export function getErrorMessage<TFieldValues extends FieldValues>( errors: InputFieldProps<TFieldValues>["errors"], name: Path<TFieldValues> ): string | null {
  const msg = (getNestedValue(errors, String(name)) as { message?: unknown } | undefined)?.message;
  return typeof msg === "string" && msg ? msg : null;
}

function InputFieldForm<TFieldValues extends FieldValues>( props: InputFieldProps<TFieldValues> ) {
  const { type = "text", label, htmlFor, id, additionalContent, errors, name, required } = props;

  const error = getErrorMessage(errors, name);
  const errorId = error ? `${id}-error` : undefined;
  const fieldProps = {
    ...props,
    required,
    ariaInvalid: Boolean(error),
    ariaDescribedBy: errorId,
  };

  const renderField = () => {
    switch (type) {
      case "textarea":
        return <TextareaField {...fieldProps} />;

      case "select":
        return <SelectField {...fieldProps} />;

      case "checkbox":
        return <CheckboxField {...fieldProps} />;

      default:
        return <InputField {...fieldProps} type={type} />;
    }
  };

  return (
    <FieldWrapper
      label={type !== "checkbox" ? label : undefined} htmlFor={htmlFor} required={required} errorId={errorId}
      error={error} additionalContent={additionalContent}> {renderField()}
    </FieldWrapper>
  );
}

export default InputFieldForm;