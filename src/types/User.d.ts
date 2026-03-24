import type { FieldErrors, UseFormRegister } from 'react-hook-form';

export interface FormData {
    email: string;
    password: string;
}

export interface RegisterFormData extends FormData {
    confirmPassword?: string;
}

export type InputFieldProps = {
    label: string;
    name: keyof RegisterFormData & string;
    htmlFor: string;
    id: string;
    register: UseFormRegister<RegisterFormData>;
    errors?: FieldErrors<RegisterFormData>;
    'data-testid'?: string;
    type?: string;
};
