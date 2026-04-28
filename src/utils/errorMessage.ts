import { ApiError } from "../services/apiRequest/apiError";

export function toErrorMessage(error: unknown, fallbackMessage: string): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return fallbackMessage;
}
