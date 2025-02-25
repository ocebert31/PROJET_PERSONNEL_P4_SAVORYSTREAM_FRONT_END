import { UseFormRegister } from "react-hook-form";
import { string } from "yup";

export type InputFieldProps = {
    label: string;
    name: string;
    htmlFor: string;
    id: string;
    register: UseFormRegister<any>;
    error?: string;
    'data-testid'?: string;
};

export interface RegisterFormData {
    password: string;
    confirmPassword?: string;
    email: string;
}
  