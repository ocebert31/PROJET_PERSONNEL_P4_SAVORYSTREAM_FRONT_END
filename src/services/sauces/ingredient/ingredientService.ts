import { fetchSessionRequest } from "../../users/authentication";
import type { SauceIngredientCreatePayload, SauceIngredientMutationResponse, SauceIngredientUpdatePayload } from "../../../types/ingredient";
import type { SauceVersioningOptions } from "../../../types/sauce";
import { buildVersioningHeaders } from "../sauceService";

export async function createSauceIngredient( sauceId: string, payload: SauceIngredientCreatePayload ): Promise<SauceIngredientMutationResponse> {
  return fetchSessionRequest<SauceIngredientMutationResponse>("sauces/ingredients", {
    method: "POST",
    body: {
      sauce_id: sauceId,
      name: payload.name,
      quantity: payload.quantity,
    },
  });
}

export async function updateSauceIngredient( sauceId: string, ingredientId: string, payload: SauceIngredientUpdatePayload, versioningOptions: SauceVersioningOptions = {},): Promise<SauceIngredientMutationResponse> {
  void sauceId;
  return fetchSessionRequest<SauceIngredientMutationResponse>(`sauces/ingredients/${ingredientId}`, {
    method: "PATCH",
    body: {
      ...payload,
      ...(versioningOptions.version !== undefined ? { version: versioningOptions.version } : {}),
    },
    headers: buildVersioningHeaders(versioningOptions),
  });
}

export async function deleteSauceIngredient( sauceId: string, ingredientId: string, versioningOptions: SauceVersioningOptions = {} ): Promise<SauceIngredientMutationResponse> {
  void sauceId;
  return fetchSessionRequest<SauceIngredientMutationResponse>(`sauces/ingredients/${ingredientId}`, {
    method: "DELETE",
    body: versioningOptions.version !== undefined ? { version: versioningOptions.version } : undefined,
    headers: buildVersioningHeaders(versioningOptions),
  });
}
