import { sanitizeBody } from "./sanitizeBody";
import { triggerFetch } from "./triggerFetch";
import type { FetchRequestOptions } from "../../types/apiRequest";
import { verifyBodyIsEmpty } from "./verifyBodyIsEmpty";

async function fetchRequest<T = unknown>(endpoint: string, { method = "GET", body = null, token = null, url = import.meta.env.VITE_API_URL_AUTH }: FetchRequestOptions = {}): Promise<T> {
  const baseUrl = url?.trim();
  if (!baseUrl) {
    throw new Error("API base URL is missing");
  }
  verifyBodyIsEmpty(body);
  const sanitizedBody = sanitizeBody(body);
  const response = await triggerFetch(endpoint, method, token, sanitizedBody, baseUrl);
  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}

export { fetchRequest };
