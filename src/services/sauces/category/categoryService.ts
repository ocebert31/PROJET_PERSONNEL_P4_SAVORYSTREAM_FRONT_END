import { fetchSessionRequest } from "../../users/authentication";
import type { SauceCategory } from "../../../types/sauceCategory";

export async function fetchAdminCategories(): Promise<SauceCategory[]> {
  const data = await fetchSessionRequest<{ categories: SauceCategory[] }>("sauces/categories", {
    method: "GET",
  });
  return data.categories;
}

export async function createAdminCategory(name: string): Promise<{ message: string; category: SauceCategory }> {
  return fetchSessionRequest<{ message: string; category: SauceCategory }>("sauces/categories", {
    method: "POST",
    body: { name },
  });
}
