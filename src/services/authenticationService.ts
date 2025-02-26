import { fetchRequest } from "./apiRequest";
import { RegisterFormData, FormData } from "../types/User";

async function postRegister(data: RegisterFormData) {
    return fetchRequest(`/users`, { method: 'POST', body: data });
}

async function postLogin(data: FormData) {
    return fetchRequest(`/sessions`, { method: 'POST', body: data });
}

export { postRegister, postLogin }; 