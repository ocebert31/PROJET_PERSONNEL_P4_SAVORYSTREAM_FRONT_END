import { fetchSessionRequest } from "../users/authentication";
import { fetchRequest } from "../apiRequest/fetchRequest";
import { buildSauceUpdatePayload } from "../../mappers/buildSauceUpdatePayload";
export { createSauceConditioning, updateSauceConditioning, deleteSauceConditioning } from "./conditioning/conditioningService";
export { createSauceIngredient, updateSauceIngredient, deleteSauceIngredient } from "./ingredient/ingredientService";
import type { SauceApiSerialized, SauceCreateResponse, SauceMutationResponse, SauceUpdatePayload, SauceVersioningOptions } from "../../types/sauce";

export async function createSauce(payload: FormData): Promise<SauceCreateResponse> {
  return fetchSessionRequest<SauceCreateResponse>("sauces", {
    method: "POST",
    body: payload,
  });
}

export async function fetchSauces(): Promise<{ sauces: SauceApiSerialized[] }> {
  return fetchRequest<{ sauces: SauceApiSerialized[] }>("sauces");
}

export async function fetchSauce(id: string): Promise<{ sauce: SauceApiSerialized }> {
  return fetchRequest<{ sauce: SauceApiSerialized }>(`sauces/${id}`);
}

export async function deleteSauce(id: string): Promise<SauceMutationResponse> {
  return fetchSessionRequest<SauceMutationResponse>(`sauces/${id}`, {
    method: "DELETE",
  });
}

export function buildVersioningHeaders(options: SauceVersioningOptions = {}): Record<string, string> {
  if (!options.eTag) {
    return {};
  }

  return { "If-Match": options.eTag };
}

export async function updateSauce( sauceId: string, payload: SauceUpdatePayload | FormData, versioningOptions: SauceVersioningOptions = {} ): Promise<SauceMutationResponse> {
  const headers = buildVersioningHeaders(versioningOptions);
  if (payload instanceof FormData) {
    if (versioningOptions.version !== undefined) {
      payload.set("version", String(versioningOptions.version));
    }
    return fetchSessionRequest<SauceMutationResponse>(`sauces/${sauceId}`, {
      method: "PATCH",
      body: payload,
      headers,
    });
  }
  const normalizedPayload = buildSauceUpdatePayload(payload);
  return fetchSessionRequest<SauceMutationResponse>(`sauces/${sauceId}`, {
    method: "PATCH",
    body: {
      ...normalizedPayload,
      ...(versioningOptions.version !== undefined ? { version: versioningOptions.version } : {}),
    },
    headers,
  });
}
