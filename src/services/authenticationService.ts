import { fetchRequest } from "./apiRequest";
import { RegisterFormData } from "../types/User";

async function postRegister(data: RegisterFormData) {
    return fetchRequest(`/users`, { method: 'POST', body: data });
}

export { postRegister }; 