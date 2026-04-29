import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAsyncStatus } from "../../hooks/useAsyncStatus";

describe("useAsyncStatus", () => {
  describe("nominal case", () => {
    it("starts in idle mode and transitions loading -> success", () => {
      const { result } = renderHook(() => useAsyncStatus());

      expect(result.current.status).toBe("idle");
      expect(result.current.errorMessage).toBeUndefined();
      expect(result.current.isIdle).toBe(true);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.isBusy).toBe(true);

      act(() => {
        result.current.startLoading();
      });

      expect(result.current.status).toBe("loading");
      expect(result.current.errorMessage).toBeUndefined();
      expect(result.current.isIdle).toBe(false);
      expect(result.current.isLoading).toBe(true);
      expect(result.current.isBusy).toBe(true);

      act(() => {
        result.current.setSuccess();
      });

      expect(result.current.status).toBe("success");
      expect(result.current.errorMessage).toBeUndefined();
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.isBusy).toBe(false);
    });
  });

  describe("variations", () => {
    it("supports non-idle initial status", () => {
      const { result } = renderHook(() => useAsyncStatus("loading"));

      expect(result.current.status).toBe("loading");
      expect(result.current.isLoading).toBe(true);
      expect(result.current.isBusy).toBe(true);
    });

    it("sets error state and derived flags", () => {
      const { result } = renderHook(() => useAsyncStatus());

      act(() => {
        result.current.setError("Erreur de chargement");
      });

      expect(result.current.status).toBe("error");
      expect(result.current.errorMessage).toBe("Erreur de chargement");
      expect(result.current.isError).toBe(true);
      expect(result.current.isBusy).toBe(false);
      expect(result.current.isSuccess).toBe(false);
    });

    it("clears error by default when startLoading is called", () => {
      const { result } = renderHook(() => useAsyncStatus());

      act(() => {
        result.current.setError("Erreur");
      });
      expect(result.current.errorMessage).toBe("Erreur");

      act(() => {
        result.current.startLoading();
      });

      expect(result.current.status).toBe("loading");
      expect(result.current.errorMessage).toBeUndefined();
    });

    it("keeps existing error when startLoading(false) is used", () => {
      const { result } = renderHook(() => useAsyncStatus());

      act(() => {
        result.current.setError("Erreur persistante");
      });

      act(() => {
        result.current.startLoading(false);
      });

      expect(result.current.status).toBe("loading");
      expect(result.current.errorMessage).toBe("Erreur persistante");
    });

    it("supports direct setStatus and setErrorMessage updates", () => {
      const { result } = renderHook(() => useAsyncStatus());

      act(() => {
        result.current.setStatus("error");
        result.current.setErrorMessage("Message manuel");
      });

      expect(result.current.status).toBe("error");
      expect(result.current.errorMessage).toBe("Message manuel");
      expect(result.current.isError).toBe(true);
    });

    it("resets to idle by default and clears error", () => {
      const { result } = renderHook(() => useAsyncStatus("success"));

      act(() => {
        result.current.setError("Erreur");
      });
      expect(result.current.status).toBe("error");
      expect(result.current.errorMessage).toBe("Erreur");

      act(() => {
        result.current.reset();
      });

      expect(result.current.status).toBe("idle");
      expect(result.current.errorMessage).toBeUndefined();
      expect(result.current.isIdle).toBe(true);
      expect(result.current.isBusy).toBe(true);
    });

    it("resets to a provided status and clears error", () => {
      const { result } = renderHook(() => useAsyncStatus());

      act(() => {
        result.current.setError("Erreur");
      });

      act(() => {
        result.current.reset("success");
      });

      expect(result.current.status).toBe("success");
      expect(result.current.errorMessage).toBeUndefined();
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.isBusy).toBe(false);
    });
  });
});
