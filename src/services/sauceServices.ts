import { fetchRequest } from "./apiRequest";
import { Sauce } from "../types/Sauce";

const URL_CRUD = import.meta.env.VITE_API_URL_CRUD;

async function getSauces() {
    return fetchRequest('/sauces', { method: 'GET', url: URL_CRUD });
}

async function createSauces(formData: Sauce) {
    return fetchRequest(`/sauces`, { method: 'POST', body: formData, url: URL_CRUD});
}

export { getSauces, createSauces }