import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useCartPageMutations } from "../../hooks/useCartPageMutations";
import * as cartContext from "../../context/cartContext";
import * as useToastModule from "../../hooks/useToast";
import type { CartLineItem } from "../../types/cart";

const line: CartLineItem = {
  id: "line-a",
  sauce_id: "sauce-a",
  sauce_name: "Sauce A",
  sauce_image_url: null,
  conditioning_id: "cond-a",
  volume: "250ml",
  quantity: 2,
  unit_price: 10,
  line_total: 20,
};

const otherLine: CartLineItem = {
  ...line,
  id: "line-b",
  sauce_id: "sauce-b",
  sauce_name: "Sauce B",
};

function mockUseCart(overrides: Partial<ReturnType<typeof cartContext.useCart>> & Record<string, unknown> = {}) {
  vi.spyOn(cartContext, "useCart").mockReturnValue({
    cart: null,
    loadStatus: "ready",
    loadError: null,
    refreshCart: vi.fn(),
    addItem: vi.fn(),
    updateLineQuantity: vi.fn().mockResolvedValue(undefined),
    removeLine: vi.fn().mockResolvedValue(undefined),
    clearCart: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  } as ReturnType<typeof cartContext.useCart>);
}

describe("useCartPageMutations", () => {
  const showSuccess = vi.fn();
  const showError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(useToastModule, "useToast").mockReturnValue({
      showSuccess,
      showError,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("initial state", () => {
    it("exposes idle busy flags", () => {
      mockUseCart({});

      const { result } = renderHook(() => useCartPageMutations());

      expect(result.current.busyLineId).toBeNull();
      expect(result.current.clearBusy).toBe(false);
    });
  });

  describe("nominal case", () => {
    it("updates quantity without success toast", async () => {
      const updateLineQuantity = vi.fn().mockResolvedValue(undefined);
      mockUseCart({ updateLineQuantity });

      const { result } = renderHook(() => useCartPageMutations());

      await act(async () => {
        result.current.changeLineQuantity(line, 3);
      });

      await waitFor(() => {
        expect(updateLineQuantity).toHaveBeenCalledWith("line-a", 3);
      });
      expect(showSuccess).not.toHaveBeenCalled();
    });

    it("calls removeLine on removeLineItem without success toast", async () => {
      const removeLine = vi.fn().mockResolvedValue(undefined);
      mockUseCart({ removeLine });

      const { result } = renderHook(() => useCartPageMutations());

      await act(async () => {
        result.current.removeLineItem(line);
      });

      await waitFor(() => {
        expect(removeLine).toHaveBeenCalledWith("line-a");
      });
      expect(showSuccess).not.toHaveBeenCalled();
    });

    it("shows success toast only when clearing the entire cart", async () => {
      const clearCart = vi.fn().mockResolvedValue(undefined);
      mockUseCart({ clearCart });

      const { result } = renderHook(() => useCartPageMutations());

      await act(async () => {
        result.current.clearEntireCart();
      });

      await waitFor(() => {
        expect(clearCart).toHaveBeenCalledTimes(1);
      });
      expect(showSuccess).toHaveBeenCalledWith("Panier vidé.");
    });
  });

  describe("busy flags during mutations", () => {
    it("sets busyLineId for the affected line until the update resolves", async () => {
      let finish!: () => void;
      const held = new Promise<void>((resolve) => {
        finish = resolve;
      });
      const updateLineQuantity = vi.fn(() => held);
      mockUseCart({ updateLineQuantity });

      const { result } = renderHook(() => useCartPageMutations());

      act(() => {
        result.current.changeLineQuantity(line, 3);
      });

      await waitFor(() => {
        expect(result.current.busyLineId).toBe("line-a");
      });

      await act(async () => {
        finish();
        await held;
      });

      await waitFor(() => {
        expect(result.current.busyLineId).toBeNull();
      });
    });

    it("sets busyLineId for the correct line when mutating another line", async () => {
      let finishB!: () => void;
      const heldB = new Promise<void>((resolve) => {
        finishB = resolve;
      });
      const updateLineQuantity = vi.fn((id: string) => (id === "line-b" ? heldB : Promise.resolve()));

      mockUseCart({ updateLineQuantity });

      const { result } = renderHook(() => useCartPageMutations());

      act(() => {
        result.current.changeLineQuantity(otherLine, 1);
      });

      await waitFor(() => {
        expect(result.current.busyLineId).toBe("line-b");
      });

      await act(async () => {
        finishB();
        await heldB;
      });
    });

    it("sets clearBusy while clearEntireCart runs then clears it", async () => {
      let finish!: () => void;
      const held = new Promise<void>((resolve) => {
        finish = resolve;
      });
      const clearCart = vi.fn(() => held);
      mockUseCart({ clearCart });

      const { result } = renderHook(() => useCartPageMutations());

      act(() => {
        result.current.clearEntireCart();
      });

      await waitFor(() => {
        expect(result.current.clearBusy).toBe(true);
      });

      await act(async () => {
        finish();
        await held;
      });

      await waitFor(() => {
        expect(result.current.clearBusy).toBe(false);
      });
    });
  });

  describe("error handling", () => {
    it("shows error toast and refreshes cart when changeLineQuantity fails", async () => {
      const refreshCart = vi.fn();
      const updateLineQuantity = vi.fn().mockRejectedValue(new Error("network"));
      mockUseCart({ refreshCart, updateLineQuantity });

      const { result } = renderHook(() => useCartPageMutations());

      await act(async () => {
        result.current.changeLineQuantity(line, 5);
      });

      await waitFor(() => {
        expect(showError).toHaveBeenCalledWith("network");
      });
      expect(refreshCart).toHaveBeenCalled();
    });

    it("uses the line action fallback message when the rejection is not an Error", async () => {
      const refreshCart = vi.fn();
      const updateLineQuantity = vi.fn().mockRejectedValue(undefined);
      mockUseCart({ refreshCart, updateLineQuantity });

      const { result } = renderHook(() => useCartPageMutations());

      await act(async () => {
        result.current.changeLineQuantity(line, 1);
      });

      await waitFor(() => {
        expect(showError).toHaveBeenCalledWith("Action impossible. Réessayez.");
      });
      expect(refreshCart).toHaveBeenCalled();
    });

    it("clears busyLineId after a failed line mutation", async () => {
      const updateLineQuantity = vi.fn().mockRejectedValue(new Error("fail"));
      mockUseCart({ updateLineQuantity });

      const { result } = renderHook(() => useCartPageMutations());

      await act(async () => {
        result.current.changeLineQuantity(line, 2);
      });

      await waitFor(() => {
        expect(showError).toHaveBeenCalled();
      });
      expect(result.current.busyLineId).toBeNull();
    });

    it("shows error and refreshes when removeLineItem fails", async () => {
      const refreshCart = vi.fn();
      const removeLine = vi.fn().mockRejectedValue(new Error("gone"));
      mockUseCart({ refreshCart, removeLine });

      const { result } = renderHook(() => useCartPageMutations());

      await act(async () => {
        result.current.removeLineItem(line);
      });

      await waitFor(() => {
        expect(showError).toHaveBeenCalledWith("gone");
      });
      expect(refreshCart).toHaveBeenCalled();
    });

    it("shows Error message when clearEntireCart fails", async () => {
      const refreshCart = vi.fn();
      const clearCart = vi.fn().mockRejectedValue(new Error("503"));
      mockUseCart({ refreshCart, clearCart });

      const { result } = renderHook(() => useCartPageMutations());

      await act(async () => {
        result.current.clearEntireCart();
      });

      await waitFor(() => {
        expect(showError).toHaveBeenCalledWith("503");
      });
      expect(refreshCart).toHaveBeenCalled();
      expect(showSuccess).not.toHaveBeenCalled();
    });

    it("uses clear-cart fallback message when clearEntireCart rejects with a non-Error value", async () => {
      const refreshCart = vi.fn();
      const clearCart = vi.fn().mockRejectedValue("server");
      mockUseCart({ refreshCart, clearCart });

      const { result } = renderHook(() => useCartPageMutations());

      await act(async () => {
        result.current.clearEntireCart();
      });

      await waitFor(() => {
        expect(showError).toHaveBeenCalledWith("Impossible de vider le panier.");
      });
      expect(refreshCart).toHaveBeenCalled();
      expect(showSuccess).not.toHaveBeenCalled();
    });

    it("clears clearBusy after a failed clearEntireCart", async () => {
      const clearCart = vi.fn().mockRejectedValue(new Error("fail"));
      mockUseCart({ clearCart });

      const { result } = renderHook(() => useCartPageMutations());

      await act(async () => {
        result.current.clearEntireCart();
      });

      await waitFor(() => {
        expect(showError).toHaveBeenCalled();
      });
      expect(result.current.clearBusy).toBe(false);
    });
  });
});
