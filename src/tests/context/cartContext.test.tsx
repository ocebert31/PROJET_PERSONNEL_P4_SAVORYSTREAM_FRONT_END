import type { ReactElement } from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderHook } from "@testing-library/react";
import { CartProvider, useCart } from "../../context/cartContext";
import * as cartService from "../../services/carts/cartService";
import type { CartPayload } from "../../types/cart";
import type { UserPublic } from "../../types/user";

const mockAuth = vi.hoisted(() => ({
  user: null as UserPublic | null,
}));

vi.mock("../../context/authContext", () => ({
  useAuth: () => ({
    get user() {
      return mockAuth.user;
    },
    refreshUser: vi.fn(),
    logout: vi.fn(),
  }),
}));

vi.mock("../../services/carts/cartService", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../services/carts/cartService")>();
  return {
    ...actual,
    fetchCart: vi.fn(),
    addCartItem: vi.fn(),
    updateCartItemQuantity: vi.fn(),
    removeCartItem: vi.fn(),
    clearCart: vi.fn(),
  };
});

function minimalUser(overrides: Partial<UserPublic> = {}): UserPublic {
  return {
    id: "user-1",
    first_name: "A",
    last_name: "B",
    email: "a@b.com",
    phone_number: null,
    role: "customer",
    created_at: "2020-01-01T00:00:00.000Z",
    updated_at: "2020-01-01T00:00:00.000Z",
    ...overrides,
  };
}

function minimalCart(overrides: Partial<CartPayload> = {}): CartPayload {
  return {
    id: "cart-ctx",
    user_id: null,
    guest_id: "g1",
    items_count: 1,
    total_amount: 9.9,
    items: [
      {
        id: "line-1",
        sauce_id: "s1",
        sauce_name: "Hot",
        sauce_image_url: null,
        conditioning_id: "c1",
        volume: "250ml",
        quantity: 1,
        unit_price: 9.9,
        line_total: 9.9,
      },
    ],
    ...overrides,
  };
}

function CartReadProbe() {
  const { cart, loadStatus, loadError } = useCart();
  return (
    <div>
      <span data-testid="status">{loadStatus}</span>
      <span data-testid="error">{loadError ?? ""}</span>
      <span data-testid="count">{cart?.items_count ?? "none"}</span>
    </div>
  );
}

function CartActionsProbe() {
  const { cart, loadStatus, loadError, refreshCart, addItem, updateLineQuantity, removeLine, clearCart } = useCart();
  return (
    <div>
      <span data-testid="status">{loadStatus}</span>
      <span data-testid="error">{loadError ?? ""}</span>
      <span data-testid="count">{cart?.items_count ?? "none"}</span>
      <span data-testid="cart-id">{cart?.id ?? ""}</span>
      <button type="button" onClick={() => void refreshCart()}>
        Rafraîchir
      </button>
      <button type="button" onClick={() => void addItem("sauce-x", "cond-y", 2)}>
        Ajouter
      </button>
      <button type="button" onClick={() => void updateLineQuantity("line-1", 4)}>
        Mettre à jour la ligne
      </button>
      <button type="button" onClick={() => void removeLine("line-1")}>
        Retirer la ligne
      </button>
      <button type="button" onClick={() => void clearCart()}>
        Vider
      </button>
    </div>
  );
}

function renderWithCartProvider(ui: ReactElement) {
  return render(<CartProvider>{ui}</CartProvider>);
}

describe("CartContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuth.user = null;
  });

  describe("useCart", () => {
    it("throws when used outside CartProvider", () => {
      expect(() => {
        renderHook(() => useCart());
      }).toThrow("useCart doit être utilisé dans un CartProvider.");
    });
  });

  describe("initial load", () => {
    it("loads the cart on mount and exposes items_count when fetch succeeds", async () => {
      vi.mocked(cartService.fetchCart).mockResolvedValue({ cart: minimalCart({ items_count: 3 }) });

      renderWithCartProvider(<CartReadProbe />);

      await waitFor(() => {
        expect(screen.getByTestId("status").textContent).toBe("ready");
      });
      expect(screen.getByTestId("count").textContent).toBe("3");
      expect(cartService.fetchCart).toHaveBeenCalledTimes(1);
    });

    it("uses the fallback error message when fetchCart rejects with a non-Error value", async () => {
      vi.mocked(cartService.fetchCart).mockRejectedValue("oops");

      renderWithCartProvider(<CartReadProbe />);

      await waitFor(() => {
        expect(screen.getByTestId("status").textContent).toBe("error");
      });
      expect(screen.getByTestId("error").textContent).toBe("Impossible de charger le panier.");
    });
  });

  describe("error handling", () => {
    it("sets error state when fetchCart rejects with an Error", async () => {
      vi.mocked(cartService.fetchCart).mockRejectedValue(new Error("network"));

      renderWithCartProvider(<CartReadProbe />);

      await waitFor(() => {
        expect(screen.getByTestId("status").textContent).toBe("error");
      });
      expect(screen.getByTestId("error").textContent).toContain("network");
    });

    it("recovers to ready after refreshCart succeeds following an error", async () => {
      vi.mocked(cartService.fetchCart).mockRejectedValueOnce(new Error("network")).mockResolvedValueOnce({
        cart: minimalCart({ items_count: 2 }),
      });

      renderWithCartProvider(<CartActionsProbe />);

      await waitFor(() => {
        expect(screen.getByTestId("status").textContent).toBe("error");
      });

      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: "Rafraîchir" }));

      await waitFor(() => {
        expect(screen.getByTestId("status").textContent).toBe("ready");
      });
      expect(screen.getByTestId("count").textContent).toBe("2");
      expect(screen.getByTestId("error").textContent).toBe("");
      expect(cartService.fetchCart).toHaveBeenCalledTimes(2);
    });
  });

  describe("cart owner change", () => {
    it("refetches the cart when the authenticated user identity changes", async () => {
      vi.mocked(cartService.fetchCart)
        .mockResolvedValueOnce({ cart: minimalCart({ id: "guest-cart", items_count: 1 }) })
        .mockResolvedValueOnce({ cart: minimalCart({ id: "user-cart", items_count: 8, user_id: "u2", guest_id: null }) });

      const { rerender } = renderWithCartProvider(<CartReadProbe />);

      await waitFor(() => {
        expect(screen.getByTestId("count").textContent).toBe("1");
      });

      mockAuth.user = minimalUser({ id: "u2" });
      rerender(
        <CartProvider>
          <CartReadProbe />
        </CartProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("count").textContent).toBe("8");
      });
      expect(cartService.fetchCart).toHaveBeenCalledTimes(2);
    });
  });

  describe("mutations", () => {
    beforeEach(() => {
      vi.mocked(cartService.fetchCart).mockResolvedValue({
        cart: minimalCart({ items_count: 1, id: "initial" }),
      });
    });

    it("updates local cart from addCartItem response", async () => {
      vi.mocked(cartService.addCartItem).mockResolvedValue({
        message: "ok",
        cart: minimalCart({ items_count: 5, id: "after-add" }),
      });

      renderWithCartProvider(<CartActionsProbe />);

      await waitFor(() => {
        expect(screen.getByTestId("status").textContent).toBe("ready");
      });

      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: "Ajouter" }));

      await waitFor(() => {
        expect(screen.getByTestId("cart-id").textContent).toBe("after-add");
      });
      expect(screen.getByTestId("count").textContent).toBe("5");
      expect(cartService.addCartItem).toHaveBeenCalledWith("sauce-x", "cond-y", 2);
    });

    it("updates local cart from updateCartItemQuantity response", async () => {
      vi.mocked(cartService.updateCartItemQuantity).mockResolvedValue({
        message: "ok",
        cart: minimalCart({ items_count: 4, id: "after-patch" }),
      });

      renderWithCartProvider(<CartActionsProbe />);

      await waitFor(() => {
        expect(screen.getByTestId("status").textContent).toBe("ready");
      });

      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: "Mettre à jour la ligne" }));

      await waitFor(() => {
        expect(screen.getByTestId("cart-id").textContent).toBe("after-patch");
      });
      expect(screen.getByTestId("count").textContent).toBe("4");
      expect(cartService.updateCartItemQuantity).toHaveBeenCalledWith("line-1", 4);
    });

    it("updates local cart from removeCartItem response", async () => {
      vi.mocked(cartService.removeCartItem).mockResolvedValue({
        message: "ok",
        cart: minimalCart({ items_count: 0, items: [], id: "after-remove" }),
      });

      renderWithCartProvider(<CartActionsProbe />);

      await waitFor(() => {
        expect(screen.getByTestId("status").textContent).toBe("ready");
      });

      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: "Retirer la ligne" }));

      await waitFor(() => {
        expect(screen.getByTestId("cart-id").textContent).toBe("after-remove");
      });
      expect(screen.getByTestId("count").textContent).toBe("0");
      expect(cartService.removeCartItem).toHaveBeenCalledWith("line-1");
    });

    it("updates local cart from clearCart response", async () => {
      vi.mocked(cartService.clearCart).mockResolvedValue({
        message: "ok",
        cart: minimalCart({ items_count: 0, items: [], total_amount: 0, id: "cleared" }),
      });

      renderWithCartProvider(<CartActionsProbe />);

      await waitFor(() => {
        expect(screen.getByTestId("status").textContent).toBe("ready");
      });

      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: "Vider" }));

      await waitFor(() => {
        expect(screen.getByTestId("cart-id").textContent).toBe("cleared");
      });
      expect(screen.getByTestId("count").textContent).toBe("0");
      expect(cartService.clearCart).toHaveBeenCalledTimes(1);
    });
  });
});
