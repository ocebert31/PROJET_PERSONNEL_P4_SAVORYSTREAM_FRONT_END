import { fetchRequest } from "./apiRequest";

const URL_CRUD = import.meta.env.VITE_API_URL_CRUD;

async function getSauces() {
    return fetchRequest('/sauces', { method: 'GET', url: URL_CRUD });
}

export { getSauces }