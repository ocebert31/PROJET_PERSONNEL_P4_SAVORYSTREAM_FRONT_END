import type { SauceUpdatePayload } from "../types/sauce";

export function normalizeString(value: string | null | undefined): string | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  const trimmedValue = value.trim();
  return trimmedValue.length === 0 ? null : trimmedValue;
}

export function buildSauceUpdatePayload(payload: SauceUpdatePayload): SauceUpdatePayload {
  return {
    ...(payload.name !== undefined ? { name: normalizeString(payload.name) ?? "" } : {}),
    ...(payload.tagline !== undefined ? { tagline: normalizeString(payload.tagline) ?? "" } : {}),
    ...(payload.description !== undefined ? { description: normalizeString(payload.description) } : {}),
    ...(payload.characteristic !== undefined ? { characteristic: normalizeString(payload.characteristic) } : {}),
    ...(payload.is_available !== undefined ? { is_available: payload.is_available } : {}),
    ...(payload.category_id !== undefined ? { category_id: normalizeString(payload.category_id) } : {}),
    ...(payload.stock_quantity !== undefined ? { stock_quantity: payload.stock_quantity } : {}),
    ...(payload.version !== undefined ? { version: payload.version } : {}),
  };
}
