const BASE_URL = import.meta.env.VITE_API_URL_AUTH;

/** Valeurs acceptées après sanitisation (aligné sur l’usage historique + fetch). */
type SanitizedBody = FormData | string | number | boolean | null | undefined;

interface FetchRequestOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    body?: unknown;
    token?: string | null;
    url?: string;
}

async function fetchRequest(
    endpoint: string,
    { method = 'GET', body = null, token = null, url = BASE_URL }: FetchRequestOptions,
): Promise<unknown> {
    try {
        verifyBodyIsEmpty(body);
        const sanitizedBody = sanitizeBody(body);
        const response = await triggerFetch(endpoint, method, token, sanitizedBody, url);
        await ensureResponseIsOk(response);
        return response.json();
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(message);
        throw error;
    }
}

function verifyBodyIsEmpty(body: unknown) {
    if (body === "") {
        throw new Error("Request body cannot be empty");
    }
}

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
        const errorData = await response.json();
        throw new Error(errorData.message || response.statusText); 
    }
    return response;
}

async function ensureResponseIsOk(response: Response): Promise<void> {
    if (!response.ok) {
        try {
            const error = await response.json(); 
            console.error('Error details:', error);
            throw new Error(error.message || "Unknown error"); 
        } catch (e) {
            throw new Error(e instanceof Error ? e.message : "Failed to parse error response");
        }
    }
}

export { fetchRequest, sanitizeBody, triggerFetch, ensureResponseIsOk, verifyBodyIsEmpty, BASE_URL };