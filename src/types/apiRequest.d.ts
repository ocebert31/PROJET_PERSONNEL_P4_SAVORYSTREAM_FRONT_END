export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export type SanitizedBody = FormData | string | number | boolean | null | undefined;

export interface FetchRequestOptions {
  method?: HttpMethod;
  body?: unknown;
  token?: string | null;
  url?: string;
}
