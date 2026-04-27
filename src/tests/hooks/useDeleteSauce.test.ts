import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDeleteSauce } from "../../hooks/useDeleteSauce";
import { deleteSauce } from "../../services/sauces/sauceService";
import { ApiError } from "../../services/apiRequest/apiError";

vi.mock("../../services/sauces/sauceService", () => ({
  deleteSauce: vi.fn(),
}));

const deleteSauceMock = vi.mocked(deleteSauce);

describe("useDeleteSauce", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("nominal case", () => {
    it("deletes sauce and returns true", async () => {
      deleteSauceMock.mockResolvedValue({ message: "ok" } as never);
      const { result } = renderHook(() => useDeleteSauce());

      let wasDeleted = false;
      await act(async () => {
        wasDeleted = await result.current.deleteSauceById("s-1");
      });

      expect(deleteSauceMock).toHaveBeenCalledWith("s-1");
      expect(wasDeleted).toBe(true);
      expect(result.current.deletingSauceId).toBeNull();
      expect(result.current.deleteErrorMessage).toBe("");
    });
  });

  describe("variations", () => {
    it("stores API message and returns false on ApiError", async () => {
      deleteSauceMock.mockRejectedValue(new ApiError("Suppression refusée", 422));
      const { result } = renderHook(() => useDeleteSauce());

      let wasDeleted = true;
      await act(async () => {
        wasDeleted = await result.current.deleteSauceById("s-1");
      });

      expect(wasDeleted).toBe(false);
      expect(result.current.deleteErrorMessage).toBe("Suppression refusée");
    });

    it("stores generic Error message and returns false", async () => {
      deleteSauceMock.mockRejectedValue(new Error("Erreur réseau"));
      const { result } = renderHook(() => useDeleteSauce());

      await act(async () => {
        await result.current.deleteSauceById("s-1");
      });

      expect(result.current.deleteErrorMessage).toBe("Erreur réseau");
    });

    it("uses fallback message for unknown errors", async () => {
      deleteSauceMock.mockRejectedValue("unexpected");
      const { result } = renderHook(() => useDeleteSauce());

      await act(async () => {
        await result.current.deleteSauceById("s-1");
      });

      expect(result.current.deleteErrorMessage).toBe("Suppression impossible.");
    });

    it("clears error message when clearDeleteError is called", async () => {
      deleteSauceMock.mockRejectedValue(new ApiError("Suppression refusée", 422));
      const { result } = renderHook(() => useDeleteSauce());

      await act(async () => {
        await result.current.deleteSauceById("s-1");
      });
      expect(result.current.deleteErrorMessage).toBe("Suppression refusée");

      act(() => {
        result.current.clearDeleteError();
      });
      expect(result.current.deleteErrorMessage).toBe("");
    });
  });
});
