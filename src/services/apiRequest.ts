/**
 * Client HTTP partagé : fetch JSON avec base URL (VITE_API_URL_AUTH), corps sérialisé,
 * jeton Bearer optionnel, et messages d’erreur lisibles (message / errors Rails / corps texte brut).
 */

const BASE_URL = import.meta.env.VITE_API_URL_AUTH;

/**
 * Construit une phrase d’erreur à partir du JSON renvoyé par l’API en cas d’échec.
 * Prend en charge : message, error, et errors (hash champ → liste de chaînes, ex. ActiveRecord).
 */
function messageFromBackendErrorBody(data: unknown, statusText: string): string {
    if (typeof data === "string") {
        const t = data.trim();
        if (t) return t;
    }
    if (data == null || typeof data !== "object") {
        return statusText.trim() || "Une erreur est survenue.";
    }
    const o = data as Record<string, unknown>;
    if (typeof o.message === "string" && o.message.trim()) {
        return o.message.trim();
    }
    if (typeof o.error === "string" && o.error.trim()) {
        return o.error.trim();
    }
    if (o.errors != null && typeof o.errors === "object" && !Array.isArray(o.errors)) {
        const parts: string[] = [];
        for (const [field, msgs] of Object.entries(o.errors as Record<string, unknown>)) {
            if (Array.isArray(msgs)) {
                const joined = msgs.filter((m): m is string => typeof m === "string").join(", ");
                if (joined) parts.push(`${field}: ${joined}`);
            } else if (typeof msgs === "string" && msgs.trim()) {
                parts.push(`${field}: ${msgs.trim()}`);
            }
        }
        if (parts.length) return parts.join(" · ");
    }
    return statusText.trim() || "Une erreur est survenue.";
}

/**
 * Lit le corps de la réponse HTTP en texte (une seule lecture du body), tente JSON puis texte brut.
 * Ne pas utiliser response.json() puis response.text() sur la même Response.
 */
async function errorMessageFromResponse(response: Response): Promise<string> {
    let raw = "";
    try {
        raw = await response.text();
    } catch {
        return response.statusText.trim() || "Une erreur est survenue.";
    }
    if (!raw.trim()) {
        return response.statusText.trim() || "Une erreur est survenue.";
    }
    try {
        return messageFromBackendErrorBody(JSON.parse(raw) as unknown, response.statusText);
    } catch {
        return messageFromBackendErrorBody(raw, response.statusText);
    }
}

/** Valeurs acceptées après sanitisation (aligné sur l’usage historique + fetch). */
type SanitizedBody = FormData | string | number | boolean | null | undefined;

interface FetchRequestOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    body?: unknown;
    token?: string | null;
    url?: string;
}

/**
 * Appel HTTP JSON : GET/POST/… vers `url + endpoint`, parse le corps JSON de la réponse OK en `T`.
 * Les erreurs HTTP sont levées sous forme d’Error avec message dérivé du corps d’erreur API.
 */
async function fetchRequest<T = unknown>(
    endpoint: string,
    { method = 'GET', body = null, token = null, url = BASE_URL }: FetchRequestOptions,
): Promise<T> {
    try {
        verifyBodyIsEmpty(body);
        const sanitizedBody = sanitizeBody(body);
        const response = await triggerFetch(endpoint, method, token, sanitizedBody, url);
        await ensureResponseIsOk(response);
        return (await response.json()) as T;
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(message);
        throw error;
    }
}

/** Interdit une chaîne vide comme corps (soumission invalide côté appelant). */
function verifyBodyIsEmpty(body: unknown) {
    if (body === "") {
        throw new Error("Request body cannot be empty");
    }
}

/** Prépare le body pour fetch : objets → JSON string, FormData inchangé. */
function sanitizeBody(body: unknown): SanitizedBody {
    if (body instanceof FormData) {
        return body;
    }
    if (body === null || body === undefined) {
        return body;
    }
    if (typeof body === "object") {
        return JSON.stringify(body);
    }
    if (typeof body === "string") {
        return body;
    }
    return body as number | boolean;
}

/** Comme l’historique `body || undefined`, puis conversion en `BodyInit` (fetch n’accepte pas `number` brut). */
function sanitizedToFetchBody(body: SanitizedBody): BodyInit | undefined {
    const payload = body || undefined;
    if (payload === undefined) {
        return undefined;
    }
    if (payload instanceof FormData) {
        return payload;
    }
    if (typeof payload === "string") {
        return payload;
    }
    return String(payload);
}

/**
 * Exécute fetch ; si le statut n’est pas 2xx, lève avec le message extrait du corps (pas de json() ici pour les erreurs : texte d’abord).
 * Les réponses OK sont renvoyées telles quelles pour permettre un seul `response.json()` côté appelant.
 */
async function triggerFetch(
    endpoint: string,
    method: string,
    token: string | null,
    body: SanitizedBody,
    url: string | null,
): Promise<Response> {
    const response = await fetch(`${url}${endpoint}`, {
        method,
        headers: {
            'Accept': 'application/json; charset=UTF-8',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...((body && !(body instanceof FormData)) && { 'Content-Type': 'application/json' }),
        },
        body: sanitizedToFetchBody(body),
    });
    if (!response.ok) {
        throw new Error(await errorMessageFromResponse(response));
    }
    return response;
}

/**
 * Vérifie le statut ; utile en test ou si une Response est fournie sans passer par triggerFetch.
 * Même logique d’erreur que pour les réponses non OK ci-dessus.
 */
async function ensureResponseIsOk(response: Response): Promise<void> {
    if (!response.ok) {
        throw new Error(await errorMessageFromResponse(response));
    }
}

export { fetchRequest, sanitizeBody, triggerFetch, ensureResponseIsOk, verifyBodyIsEmpty, BASE_URL };
