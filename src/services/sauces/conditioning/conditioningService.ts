import { fetchSessionRequest } from "../../users/authentication";
import type { SauceConditioningCreatePayload, SauceConditioningMutationResponse, SauceConditioningUpdatePayload } from "../../../types/conditioning";
import type { SauceVersioningOptions } from "../../../types/sauce";
import { buildVersioningHeaders } from "../sauceService";

export async function createSauceConditioning( sauceId: string, payload: SauceConditioningCreatePayload ): Promise<SauceConditioningMutationResponse> {
  return fetchSessionRequest<SauceConditioningMutationResponse>("sauces/conditionings", {
    method: "POST",
    body: {
      sauce_id: sauceId,
      volume: payload.volume,
      price: payload.price,
    },
  });
}

export async function updateSauceConditioning( sauceId: string, conditioningId: string, payload: SauceConditioningUpdatePayload, versioningOptions: SauceVersioningOptions = {} ): Promise<SauceConditioningMutationResponse> {
  void sauceId;
  return fetchSessionRequest<SauceConditioningMutationResponse>(`sauces/conditionings/${conditioningId}`, {
    method: "PATCH",
    body: {
      ...payload,
      ...(versioningOptions.version !== undefined ? { version: versioningOptions.version } : {}),
    },
    headers: buildVersioningHeaders(versioningOptions),
  });
}

export async function deleteSauceConditioning( sauceId: string, conditioningId: string, versioningOptions: SauceVersioningOptions = {} ): Promise<SauceConditioningMutationResponse> {
  void sauceId;
  return fetchSessionRequest<SauceConditioningMutationResponse>(`sauces/conditionings/${conditioningId}`, {
    method: "DELETE",
    body: versioningOptions.version !== undefined ? { version: versioningOptions.version } : undefined,
    headers: buildVersioningHeaders(versioningOptions),
  });
}
