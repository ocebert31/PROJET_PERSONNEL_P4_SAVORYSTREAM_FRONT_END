const BASE_URL = import.meta.env.VITE_API_URL_AUTH;

interface FetchRequestOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    body?: any;
    token?: string | null;
    url?: string;
}

async function fetchRequest(endpoint: string, { method = 'GET', body = null, token = null, url = BASE_URL }: FetchRequestOptions): Promise<any> {
    try {
        verifyBodyIsEmpty(body);
        const sanitizedBody = sanitizeBody(body);
        const response = await triggerFetch(endpoint, method, token, sanitizedBody, url);
        await ensureResponseIsOk(response);
        return response.json();
    } catch (error: any) {
        console.error(error.message);
        throw error; 
    }
}

function verifyBodyIsEmpty(body: any) {
    if(body === "") {
        throw new Error("Request body cannot be empty")
    }
}

function sanitizeBody (body: any) {
    if (body instanceof FormData) {
      return body;
    }
    if (typeof body === "object" && body !== null) {
      return JSON.stringify(body);
    }
    return body; 
};

async function triggerFetch(endpoint: string, method: string, token: string | null, body: any, url: string | null): Promise<Response> {
    const response = await fetch(`${url}${endpoint}`, {
        method,
        headers: {
            'Accept': 'application/json; charset=UTF-8',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...((body && !(body instanceof FormData)) && { 'Content-Type': 'application/json' }),
        },
        body: body || undefined,
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