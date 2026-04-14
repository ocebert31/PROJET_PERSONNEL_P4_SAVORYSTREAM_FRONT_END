import { fetchSessionRequest } from "../../users/authentication";
import type { Sauce_category } from "../../../types/Sauce_category";

export async function fetchAdminCategories(): Promise<Sauce_category[]> {
  const data = await fetchSessionRequest<{ categories: Sauce_category[] }>("sauces/categories", {
    method: "GET",
  });
  return data.categories;
}
