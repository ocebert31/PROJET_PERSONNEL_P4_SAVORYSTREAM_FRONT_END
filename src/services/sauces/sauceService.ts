import { fetchSessionRequest } from "../users/authentication";
import type { SauceCreateResponse } from "../../types/sauce";

export async function createSauce(payload: FormData): Promise<SauceCreateResponse> {
  return fetchSessionRequest<SauceCreateResponse>("sauces", {
    method: "POST",
    body: payload,
  });
}
