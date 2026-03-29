import { fetchRequest } from "./apiRequest";
import type { RegisterFormData, FormData, RegisterSuccessResponse } from "../types/User";

async function postRegister(data: RegisterFormData): Promise<RegisterSuccessResponse> {
    return fetchRequest<RegisterSuccessResponse>(`users/registrations`, { method: "POST", body: data });
}

async function postLogin(data: FormData) {
    return fetchRequest(`users/sessions`, { method: "POST", body: data });
}

export { postRegister, postLogin }; 