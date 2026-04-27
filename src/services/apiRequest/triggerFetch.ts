import { ApiError } from "./apiError";
import { errorMessageFromResponse } from "./errorMessageFromResponse";
import type { HttpMethod, SanitizedBody } from "../../types/apiRequest";

async function triggerFetch(
  endpoint: string,
  method: HttpMethod,
  token: string | null,
  body: SanitizedBody,
  url: string,
  headers: Record<string, string> = {},
): Promise<Response> {
  const payload = body ?? undefined;

  const response = await fetch(`${url}${endpoint}`, {
    method,
    credentials: "include",
    headers: {
      Accept: "application/json; charset=UTF-8",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(body && !(body instanceof FormData) && { "Content-Type": "application/json" }),
      ...headers,
    },
    body:
      payload === undefined
        ? undefined
        : payload instanceof FormData
          ? payload
          : typeof payload === "string"
            ? payload
            : String(payload),
  });

  if (!response.ok) {
    throw new ApiError(await errorMessageFromResponse(response), response.status);
  }

  return response;
}

export { triggerFetch };
