import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useEditCategory } from "../../hooks/useEditCategory";
import { updateAdminCategory } from "../../services/sauces/category/categoryService";
import { ApiError } from "../../services/apiRequest/apiError";
import type { SauceCategory } from "../../types/sauceCategory";

vi.mock("../../services/sauces/category/categoryService", () => ({
  updateAdminCategory: vi.fn(),
}));

const updateAdminCategoryMock = vi.mocked(updateAdminCategory);

describe("useEditCategory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("nominal case", () => {
    it("updates category and returns updated category", async () => {
      updateAdminCategoryMock.mockResolvedValue({
        message: "Catégorie mise à jour.",
        category: {
          id: "c-1",
          name: "Fumée",
          created_at: "2026-01-01T00:00:00.000Z",
          updated_at: "2026-01-01T00:00:00.000Z",
        },
      });
      const { result } = renderHook(() => useEditCategory());

      let category: SauceCategory | null = null;
      await act(async () => {
        category = await result.current.editCategoryById("c-1", "Fumée");
      });

      expect(updateAdminCategoryMock).toHaveBeenCalledWith("c-1", "Fumée");
      expect(category).toEqual(
        expect.objectContaining({
          id: "c-1",
          name: "Fumée",
        }),
      );
      expect(result.current.editingCategoryId).toBeNull();
      expect(result.current.editErrorMessage).toBe("");
    });
  });

  describe("variations", () => {
    it("sets editingCategoryId while request is pending and clears it after resolve", async () => {
      let resolveUpdate: (() => void) | undefined;
      updateAdminCategoryMock.mockImplementation(
        () =>
          new Promise((resolve) => {
            resolveUpdate = () =>
              resolve({
                message: "Catégorie mise à jour.",
                category: {
                  id: "c-1",
                  name: "Fumée",
                  created_at: "2026-01-01T00:00:00.000Z",
                  updated_at: "2026-01-01T00:00:00.000Z",
                },
              });
          })
      );
      const { result } = renderHook(() => useEditCategory());

      let editPromise: Promise<SauceCategory | null> | undefined;
      await act(async () => {
        editPromise = result.current.editCategoryById("c-1", "Fumée");
      });

      expect(result.current.editingCategoryId).toBe("c-1");

      await act(async () => {
        resolveUpdate?.();
        await editPromise;
      });

      expect(result.current.editingCategoryId).toBeNull();
    });

    it("stores ApiError message and returns null", async () => {
      updateAdminCategoryMock.mockRejectedValue(new ApiError("Nom déjà utilisé", 422));
      const { result } = renderHook(() => useEditCategory());

      let category = {} as object | null;
      await act(async () => {
        category = await result.current.editCategoryById("c-1", "Fumée");
      });

      expect(category).toBeNull();
      expect(result.current.editErrorMessage).toBe("Nom déjà utilisé");
    });

    it("stores native Error message and returns null", async () => {
      updateAdminCategoryMock.mockRejectedValue(new Error("Network down"));
      const { result } = renderHook(() => useEditCategory());

      let category = {} as object | null;
      await act(async () => {
        category = await result.current.editCategoryById("c-1", "Fumée");
      });

      expect(category).toBeNull();
      expect(result.current.editErrorMessage).toBe("Network down");
    });

    it("stores fallback message for non-error rejection and returns null", async () => {
      updateAdminCategoryMock.mockRejectedValue("plain-string-error");
      const { result } = renderHook(() => useEditCategory());

      let category = {} as object | null;
      await act(async () => {
        category = await result.current.editCategoryById("c-1", "Fumée");
      });

      expect(category).toBeNull();
      expect(result.current.editErrorMessage).toBe("Mise à jour impossible.");
    });

    it("clears previous edit error when retrying an update", async () => {
      updateAdminCategoryMock
        .mockRejectedValueOnce(new ApiError("Nom déjà utilisé", 422))
        .mockResolvedValueOnce({
          message: "Catégorie mise à jour.",
          category: {
            id: "c-1",
            name: "Fumée",
            created_at: "2026-01-01T00:00:00.000Z",
            updated_at: "2026-01-01T00:00:00.000Z",
          },
        });
      const { result } = renderHook(() => useEditCategory());

      await act(async () => {
        await result.current.editCategoryById("c-1", "Fumée");
      });
      expect(result.current.editErrorMessage).toBe("Nom déjà utilisé");

      await act(async () => {
        await result.current.editCategoryById("c-1", "Fumée");
      });
      expect(result.current.editErrorMessage).toBe("");
    });

    it("clears edit error message", async () => {
      updateAdminCategoryMock.mockRejectedValue(new ApiError("Nom déjà utilisé", 422));
      const { result } = renderHook(() => useEditCategory());

      await act(async () => {
        await result.current.editCategoryById("c-1", "Fumée");
      });
      expect(result.current.editErrorMessage).toBe("Nom déjà utilisé");

      act(() => {
        result.current.clearEditError();
      });
      expect(result.current.editErrorMessage).toBe("");
    });
  });
});
