import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDeleteCategory } from "../../hooks/useDeleteCategory";
import { deleteAdminCategory } from "../../services/sauces/category/categoryService";
import { ApiError } from "../../services/apiRequest/apiError";

vi.mock("../../services/sauces/category/categoryService", () => ({
  deleteAdminCategory: vi.fn(),
}));

const deleteAdminCategoryMock = vi.mocked(deleteAdminCategory);

describe("useDeleteCategory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("nominal case", () => {
    it("deletes category and returns true", async () => {
      deleteAdminCategoryMock.mockResolvedValue({ message: "ok" });
      const { result } = renderHook(() => useDeleteCategory());

      let wasDeleted = false;
      await act(async () => {
        wasDeleted = await result.current.deleteCategoryById("c-1");
      });

      expect(deleteAdminCategoryMock).toHaveBeenCalledWith("c-1");
      expect(wasDeleted).toBe(true);
      expect(result.current.deletingCategoryId).toBeNull();
      expect(result.current.deleteErrorMessage).toBe("");
    });
  });

  describe("variations", () => {
    it("sets deletingCategoryId while request is pending and clears it after resolve", async () => {
      let resolveDelete: (() => void) | undefined;
      deleteAdminCategoryMock.mockImplementation(
        () =>
          new Promise((resolve) => {
            resolveDelete = () => resolve({ message: "ok" });
          })
      );
      const { result } = renderHook(() => useDeleteCategory());

      let deletePromise: Promise<boolean> | undefined;
      await act(async () => {
        deletePromise = result.current.deleteCategoryById("c-1");
      });

      expect(result.current.deletingCategoryId).toBe("c-1");

      await act(async () => {
        resolveDelete?.();
        await deletePromise;
      });

      expect(result.current.deletingCategoryId).toBeNull();
    });

    it("stores ApiError message and returns false", async () => {
      deleteAdminCategoryMock.mockRejectedValue(new ApiError("Suppression refusée", 422));
      const { result } = renderHook(() => useDeleteCategory());

      let wasDeleted = true;
      await act(async () => {
        wasDeleted = await result.current.deleteCategoryById("c-1");
      });

      expect(wasDeleted).toBe(false);
      expect(result.current.deleteErrorMessage).toBe("Suppression refusée");
    });

    it("stores native Error message and returns false", async () => {
      deleteAdminCategoryMock.mockRejectedValue(new Error("Network down"));
      const { result } = renderHook(() => useDeleteCategory());

      let wasDeleted = true;
      await act(async () => {
        wasDeleted = await result.current.deleteCategoryById("c-1");
      });

      expect(wasDeleted).toBe(false);
      expect(result.current.deleteErrorMessage).toBe("Network down");
    });

    it("stores fallback message for non-error rejection and returns false", async () => {
      deleteAdminCategoryMock.mockRejectedValue("plain-string-error");
      const { result } = renderHook(() => useDeleteCategory());

      let wasDeleted = true;
      await act(async () => {
        wasDeleted = await result.current.deleteCategoryById("c-1");
      });

      expect(wasDeleted).toBe(false);
      expect(result.current.deleteErrorMessage).toBe("Suppression impossible.");
    });

    it("clears previous delete error when retrying a delete", async () => {
      deleteAdminCategoryMock
        .mockRejectedValueOnce(new ApiError("Suppression refusée", 422))
        .mockResolvedValueOnce({ message: "ok" });
      const { result } = renderHook(() => useDeleteCategory());

      await act(async () => {
        await result.current.deleteCategoryById("c-1");
      });
      expect(result.current.deleteErrorMessage).toBe("Suppression refusée");

      await act(async () => {
        await result.current.deleteCategoryById("c-1");
      });
      expect(result.current.deleteErrorMessage).toBe("");
    });

    it("clears delete error message", async () => {
      deleteAdminCategoryMock.mockRejectedValue(new ApiError("Suppression refusée", 422));
      const { result } = renderHook(() => useDeleteCategory());

      await act(async () => {
        await result.current.deleteCategoryById("c-1");
      });
      expect(result.current.deleteErrorMessage).toBe("Suppression refusée");

      act(() => {
        result.current.clearDeleteError();
      });
      expect(result.current.deleteErrorMessage).toBe("");
    });
  });
});
