import { FieldError, UseFormRegister } from 'react-hook-form';
import { string } from "yup";

export type InputFieldProps = {
    label: string;
    name: string;
    htmlFor: string;
    id: string;
    register: UseFormRegister<any>;
    errors?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
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