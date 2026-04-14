import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import * as categoryService from "../../services/sauces/category/categoryService";
import { useGetSauceCategories } from "../../hooks/useGetSauceCategories";

const hoisted = vi.hoisted(() => ({
  showError: vi.fn(),
}));

vi.mock("../../hooks/useToast", () => ({
  useToast: () => ({
    showError: hoisted.showError,
    showSuccess: vi.fn(),
  }),
}));

vi.mock("../../services/sauces/category/categoryService", () => ({
  fetchAdminCategories: vi.fn(),
}));

const iso = "2026-01-01T00:00:00.000Z";

function category(overrides: Partial<{ id: string; name: string }> = {}) {
  return {
    id: "cat-1",
    name: "Piquante",
    created_at: iso,
    updated_at: iso,
    ...overrides,
  };
}

describe("useGetSauceCategories", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("nominal case", () => {
    it("maps fetched categories to selectOptions and clears error when fetch succeeds", async () => {
      vi.mocked(categoryService.fetchAdminCategories).mockResolvedValue([
        category({ id: "a", name: "Piquante" }),
        category({ id: "b", name: "Douce" }),
      ]);

      const { result } = renderHook(() => useGetSauceCategories());

      await waitFor(() => {
        expect(result.current.categoriesBlocked).toBe(false);
      });

      expect(categoryService.fetchAdminCategories).toHaveBeenCalledTimes(1);
      expect(result.current.error).toBeNull();
      expect(result.current.selectOptions).toEqual([
        { value: "a", label: "Piquante" },
        { value: "b", label: "Douce" },
      ]);
      expect(hoisted.showError).not.toHaveBeenCalled();
    });
  });

  describe("variations", () => {
    it("exposes empty selectOptions and unblocks when the API returns an empty list", async () => {
      vi.mocked(categoryService.fetchAdminCategories).mockResolvedValue([]);

      const { result } = renderHook(() => useGetSauceCategories());

      await waitFor(() => {
        expect(result.current.categoriesBlocked).toBe(false);
      });

      expect(result.current.error).toBeNull();
      expect(result.current.selectOptions).toEqual([]);
      expect(hoisted.showError).not.toHaveBeenCalled();
    });

    it("sets error from Error.message, shows toast, and blocks when fetch rejects with Error", async () => {
      vi.mocked(categoryService.fetchAdminCategories).mockRejectedValue(new Error("Réseau indisponible"));

      const { result } = renderHook(() => useGetSauceCategories());

      await waitFor(() => {
        expect(result.current.error).toBe("Réseau indisponible");
      });

      expect(result.current.categoriesBlocked).toBe(true);
      expect(result.current.selectOptions).toEqual([]);
      expect(hoisted.showError).toHaveBeenCalledTimes(1);
      expect(hoisted.showError).toHaveBeenCalledWith("Réseau indisponible");
    });

    it("uses fallback copy when fetch rejects with a non-Error value", async () => {
      vi.mocked(categoryService.fetchAdminCategories).mockRejectedValue("unexpected");

      const { result } = renderHook(() => useGetSauceCategories());

      await waitFor(() => {
        expect(result.current.error).toBe("Impossible de charger les catégories.");
      });

      expect(result.current.categoriesBlocked).toBe(true);
      expect(hoisted.showError).toHaveBeenCalledWith("Impossible de charger les catégories.");
    });
  });
});
