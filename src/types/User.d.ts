export interface FormData {
    password: string;
    email?: string;
    phoneNumber?: string;
}

export type LoginFormData = FormData;

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

export type SessionCreateResponse = {
    message: string;
    access_token: string;
    access_expires_in: number;
    refresh_expires_at: string;
    remember_me: boolean;
    user: UserPublic;
};

export type SessionRefreshResponse = {
    access_token: string;
    access_expires_in: number;
    refresh_expires_at: string;
};

export type SessionMeResponse = {
    user: UserPublic;
};

