import { describe, it, expect, vi, beforeEach } from "vitest";
import * as authentication from "../../../../services/users/authentication";
import { createAdminCategory, fetchAdminCategories } from "../../../../services/sauces/category/categoryService";
import type { SauceCategory } from "../../../../types/sauceCategory";

vi.mock("../../../../services/users/authentication", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../../../services/users/authentication")>();
  return {
    ...actual,
    fetchSessionRequest: vi.fn(),
  };
});

function category(overrides: Partial<SauceCategory> = {}): SauceCategory {
  const iso = "2026-01-01T00:00:00.000Z";
  return {
    id: "cat-1",
    name: "Piquante",
    created_at: iso,
    updated_at: iso,
    ...overrides,
  };
}

describe("categoryService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("fetchAdminCategories", () => {
    describe("nominal case", () => {
      it("calls fetchSessionRequest with GET on sauces/categories and returns categories", async () => {
        const categories = [category(), category({ id: "cat-2", name: "Douce" })];
        vi.mocked(authentication.fetchSessionRequest).mockResolvedValue({ categories });

        const result = await fetchAdminCategories();

        expect(authentication.fetchSessionRequest).toHaveBeenCalledTimes(1);
        expect(authentication.fetchSessionRequest).toHaveBeenCalledWith("sauces/categories", { method: "GET" });
        expect(result).toEqual(categories);
      });
    });

    describe("variations", () => {
      it("returns an empty array when the API returns no categories", async () => {
        vi.mocked(authentication.fetchSessionRequest).mockResolvedValue({ categories: [] });

        const result = await fetchAdminCategories();

        expect(result).toEqual([]);
      });

      it("propagates rejection from fetchSessionRequest", async () => {
        vi.mocked(authentication.fetchSessionRequest).mockRejectedValue(new Error("Session expirée"));

        await expect(fetchAdminCategories()).rejects.toThrow("Session expirée");
      });
    });
  });

  describe("createAdminCategory", () => {
    describe("nominal case", () => {
      it("calls fetchSessionRequest with POST on sauces/categories and returns created category", async () => {
        const created = category({ id: "cat-9", name: "Smoky" });
        vi.mocked(authentication.fetchSessionRequest).mockResolvedValue({
          message: "Catégorie créée.",
          category: created,
        });

        const result = await createAdminCategory("Smoky");

        expect(authentication.fetchSessionRequest).toHaveBeenCalledTimes(1);
        expect(authentication.fetchSessionRequest).toHaveBeenCalledWith("sauces/categories", {
          method: "POST",
          body: { name: "Smoky" },
        });
        expect(result).toEqual({ message: "Catégorie créée.", category: created });
      });
    });

    describe("variations", () => {
      it("propagates rejection from fetchSessionRequest", async () => {
        vi.mocked(authentication.fetchSessionRequest).mockRejectedValue(new Error("Nom déjà utilisé"));

        await expect(createAdminCategory("Smoky")).rejects.toThrow("Nom déjà utilisé");
      });
    });
  });
});
