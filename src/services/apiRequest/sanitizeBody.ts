import type { SanitizedBody } from "../../types/apiRequest";

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

export { sanitizeBody };
