import type { FieldValues, Path } from "react-hook-form";
import type { InputFieldProps } from "../../types/Field";
import InputField from "./InputField";
import FieldWrapper from "./FieldWrapper";
import TextareaField from "./TextareaField";
import SelectField from "./SelectField";
import CheckboxField from "./CheckboxField";

function getErrorMessage<TFieldValues extends FieldValues>( errors: InputFieldProps<TFieldValues>["errors"], name: Path<TFieldValues> ): string | null {
  const msg = errors?.[name]?.message;
  return typeof msg === "string" && msg ? msg : null;
}

function InputFieldForm<TFieldValues extends FieldValues>(
  props: InputFieldProps<TFieldValues>,
) {
  const { type = "text", label, htmlFor, additionalContent, errors, name } = props;

  const error = getErrorMessage(errors, name);

  const renderField = () => {
    switch (type) {
      case "textarea":
        return <TextareaField {...props} />;

      case "select":
        return <SelectField {...props} />;

      case "checkbox":
        return <CheckboxField {...props} />;

      default:
        return <InputField {...props} type={type} />;
    }
  };

  return (
    <FieldWrapper label={type !== "checkbox" ? label : undefined} htmlFor={htmlFor} error={error} additionalContent={additionalContent}>
      {renderField()}
    </FieldWrapper>
  );
}

export default InputFieldForm;