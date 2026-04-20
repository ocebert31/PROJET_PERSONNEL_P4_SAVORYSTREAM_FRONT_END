import { fetchSessionRequest } from "../users/authentication";
import { fetchRequest } from "../apiRequest/fetchRequest";
import type { SauceApiSerialized, SauceCreateResponse } from "../../types/sauce";

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
