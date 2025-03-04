import { UseFormRegister } from "react-hook-form";
import { string } from "yup";

export type InputFieldProps = {
    label: string;
    name: string;
    htmlFor: string;
    id: string;
    register: UseFormRegister<any>;
    error?: string | undefined;
    'data-testid'?: string;
    type: string;
};

export interface FormData {
    email: string;
    password: string;
}

export interface RegisterFormData extends FormData {
    confirmPassword?: string;
}