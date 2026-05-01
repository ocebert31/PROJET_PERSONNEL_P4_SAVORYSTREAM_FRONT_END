import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDashboardEntityLoader } from "../../hooks/useDashboardEntityLoader";

describe("useDashboardEntityLoader", () => {
  it("loads items and updates success state callbacks", async () => {
    const fetchItems = vi.fn().mockResolvedValue([{ id: "1" }]);
    const setItems = vi.fn();
    const clearTransientError = vi.fn();
    const setErrorMessage = vi.fn();
    const startLoading = vi.fn();
    const setSuccess = vi.fn();
    const setError = vi.fn();

    const { result } = renderHook(() =>
      useDashboardEntityLoader({
        fetchItems,
        setItems,
        clearTransientError,
        setErrorMessage,
        startLoading,
        setSuccess,
        setError,
        errorFallbackMessage: "Erreur de chargement",
      }),
    );

    await act(async () => {
      await result.current();
    });

    expect(startLoading).toHaveBeenCalledWith(false);
    expect(setErrorMessage).toHaveBeenCalledWith("");
    expect(clearTransientError).toHaveBeenCalledTimes(1);
    expect(setItems).toHaveBeenCalledWith([{ id: "1" }]);
    expect(setSuccess).toHaveBeenCalledTimes(1);
    expect(setError).not.toHaveBeenCalled();
  });

  it("clears list and forwards fallback error message when loading fails", async () => {
    const fetchItems = vi.fn().mockRejectedValue(new Error("boom"));
    const setItems = vi.fn();
    const clearTransientError = vi.fn();
    const setErrorMessage = vi.fn();
    const startLoading = vi.fn();
    const setSuccess = vi.fn();
    const setError = vi.fn();

    const { result } = renderHook(() =>
      useDashboardEntityLoader({
        fetchItems,
        setItems,
        clearTransientError,
        setErrorMessage,
        startLoading,
        setSuccess,
        setError,
        errorFallbackMessage: "Impossible de charger les données.",
      }),
    );

    await act(async () => {
      await result.current();
    });

    expect(setItems).toHaveBeenCalledWith([]);
    expect(setError).toHaveBeenCalledWith("boom");
    expect(setSuccess).not.toHaveBeenCalled();
  });

  it("uses fallback error message when rejection reason is not an Error", async () => {
    const fetchItems = vi.fn().mockRejectedValue(null);
    const setItems = vi.fn();
    const clearTransientError = vi.fn();
    const setErrorMessage = vi.fn();
    const startLoading = vi.fn();
    const setSuccess = vi.fn();
    const setError = vi.fn();

    const { result } = renderHook(() =>
      useDashboardEntityLoader({
        fetchItems,
        setItems,
        clearTransientError,
        setErrorMessage,
        startLoading,
        setSuccess,
        setError,
        errorFallbackMessage: "Impossible de charger les données.",
      }),
    );

    await act(async () => {
      await result.current();
    });

    expect(setError).toHaveBeenCalledWith("Impossible de charger les données.");
  });

  it("runs UI state reset callbacks before resolving the fetch", async () => {
    const executionSteps: string[] = [];
    const fetchItems = vi.fn(async () => {
      executionSteps.push("fetchItems");
      return [{ id: "1" }];
    });
    const setItems = vi.fn();
    const clearTransientError = vi.fn(() => executionSteps.push("clearTransientError"));
    const setErrorMessage = vi.fn(() => executionSteps.push("setErrorMessage"));
    const startLoading = vi.fn(() => executionSteps.push("startLoading"));
    const setSuccess = vi.fn();
    const setError = vi.fn();

    const { result } = renderHook(() =>
      useDashboardEntityLoader({
        fetchItems,
        setItems,
        clearTransientError,
        setErrorMessage,
        startLoading,
        setSuccess,
        setError,
        errorFallbackMessage: "Impossible de charger les données.",
      }),
    );

    await act(async () => {
      await result.current();
    });

    expect(executionSteps.slice(0, 4)).toEqual([
      "startLoading",
      "setErrorMessage",
      "clearTransientError",
      "fetchItems",
    ]);
  });

  it("returns a stable callback when dependencies do not change", () => {
    const fetchItems = vi.fn().mockResolvedValue([{ id: "1" }]);
    const setItems = vi.fn();
    const clearTransientError = vi.fn();
    const setErrorMessage = vi.fn();
    const startLoading = vi.fn();
    const setSuccess = vi.fn();
    const setError = vi.fn();

    const { result, rerender } = renderHook(() =>
      useDashboardEntityLoader({
        fetchItems,
        setItems,
        clearTransientError,
        setErrorMessage,
        startLoading,
        setSuccess,
        setError,
        errorFallbackMessage: "Impossible de charger les données.",
      }),
    );

    const firstCallback = result.current;
    rerender();
    expect(result.current).toBe(firstCallback);
  });
});
