import type { ReactNode } from "react";
import type { FieldErrors, FieldValues, Path, UseFormRegister } from "react-hook-form";

export type SelectOption = { value: string; label: string };

export type FieldWrapperProps = {
  label?: string;
  htmlFor?: string;
  error: string | null;
  children: ReactNode;
  additionalContent?: ReactNode;
};

export type InputFieldProps<TFieldValues extends FieldValues> = {
  label: string;
  name: Path<TFieldValues>;
  htmlFor: string;
  id: string;
  register: UseFormRegister<TFieldValues>;
  errors?: FieldErrors<TFieldValues>;
  "data-testid"?: string;
  type?: string;
  disabled?: boolean;
  min?: number | string;
  step?: number | string;
  accept?: string;
  valueAsNumber?: boolean;
  options?: SelectOption[];
  placeholderOption?: SelectOption;
  additionalContent?: ReactNode;
};
