import type { FieldErrors, UseFormRegister } from 'react-hook-form';

export interface FormData {
    email: string;
    password: string;
}

export interface RegisterFormData extends FormData {
    confirmPassword?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
}

export interface UserPublic {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string | null;
    role: string;
    created_at: string;
    updated_at: string;
}

export interface RegisterSuccessResponse {
    message: string;
    user: UserPublic;
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
