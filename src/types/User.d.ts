import type { FieldErrors, FieldValues, Path, UseFormRegister } from 'react-hook-form';

export interface FormData {
    password: string;
    email?: string;
    phoneNumber?: string;
}

export interface LoginFormData extends FormData {}

export interface RegisterFormData extends FormData {
    confirmPassword?: string;
    firstName?: string;
    lastName?: string;
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

export type InputFieldProps<TFieldValues extends FieldValues> = {
    label: string;
    name: Path<TFieldValues>;
    htmlFor: string;
    id: string;
    register: UseFormRegister<TFieldValues>;
    errors?: FieldErrors<TFieldValues>;
    'data-testid'?: string;
    type?: string;
};
