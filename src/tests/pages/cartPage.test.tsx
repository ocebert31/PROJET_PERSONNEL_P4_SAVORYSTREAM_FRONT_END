import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import CartPage from "../../pages/cartPage";
import * as cartContext from "../../context/cartContext";
import type { CartLineItem, CartPayload } from "../../types/cart";

function buildUseCartReturn(overrides: Partial<ReturnType<typeof cartContext.useCart>> = {}) {
  return {
    cart: null as CartPayload | null,
    loadStatus: "ready" as const,
    loadError: null,
    refreshCart: vi.fn(),
    addItem: vi.fn(),
    updateLineQuantity: vi.fn().mockResolvedValue(undefined),
    removeLine: vi.fn().mockResolvedValue(undefined),
    clearCart: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

function minimalLine(overrides: Partial<CartLineItem> = {}): CartLineItem {
  return {
    id: "line-a",
    sauce_id: "sauce-a",
    sauce_name: "Sauce A",
    sauce_image_url: null,
    conditioning_id: "cond-a",
    volume: "250ml",
    quantity: 2,
    unit_price: 10,
    line_total: 20,
    ...overrides,
  };
}

function cartWithLines(items: CartLineItem[], overrides: Partial<CartPayload> = {}): CartPayload {
  const total_amount = items.reduce((sum, li) => sum + li.line_total, 0);
  const items_count = items.reduce((sum, li) => sum + li.quantity, 0);
  return {
    id: "c1",
    user_id: null,
    guest_id: "g",
    items_count,
    total_amount,
    items,
    ...overrides,
  };
}

function renderCartPage() {
  return render(
    <MemoryRouter>
      <CartPage />
    </MemoryRouter>,
  );
}

describe("CartPage", () => {
  beforeEach(() => {
    vi.spyOn(cartContext, "useCart").mockReturnValue(buildUseCartReturn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("loading and error states", () => {
    it("shows loading label while awaiting the first cart payload", () => {
      vi.spyOn(cartContext, "useCart").mockReturnValue(buildUseCartReturn({ cart: null, loadStatus: "loading" }));

      renderCartPage();

      expect(screen.getByText(/Chargement du panier/i)).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "Panier" })).toBeInTheDocument();
    });

    it("shows inline cart content while loading if cart data already exists", () => {
      const cart = cartWithLines([minimalLine()]);
      vi.spyOn(cartContext, "useCart").mockReturnValue(buildUseCartReturn({ cart, loadStatus: "loading" }));

      renderCartPage();

      expect(screen.queryByText(/Chargement du panier/i)).not.toBeInTheDocument();
      expect(screen.getByText("Sauce A")).toBeInTheDocument();
    });

    it("shows loadError text when the cart request fails", () => {
      vi.spyOn(cartContext, "useCart").mockReturnValue(
        buildUseCartReturn({ cart: null, loadStatus: "error", loadError: "Service indisponible." }),
      );

      renderCartPage();

      expect(screen.getByText("Service indisponible.")).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "Panier" })).toBeInTheDocument();
    });

    it("shows generic error copy when loadError is missing", () => {
      vi.spyOn(cartContext, "useCart").mockReturnValue(buildUseCartReturn({ cart: null, loadStatus: "error", loadError: null }));

      renderCartPage();

      expect(screen.getByText(/Erreur de chargement/i)).toBeInTheDocument();
    });

    it("calls refreshCart when the user clicks retry after an error", async () => {
      const refreshCart = vi.fn();
      vi.spyOn(cartContext, "useCart").mockReturnValue(
        buildUseCartReturn({ cart: null, loadStatus: "error", loadError: "oops", refreshCart }),
      );

      const user = userEvent.setup();
      renderCartPage();

      await user.click(screen.getByRole("button", { name: /Réessayer/i }));

      expect(refreshCart).toHaveBeenCalledTimes(1);
    });
  });

  describe("edge cases", () => {
    it("renders nothing when cart is null while ready", () => {
      vi.spyOn(cartContext, "useCart").mockReturnValue(buildUseCartReturn({ cart: null, loadStatus: "ready" }));

      const { container } = renderCartPage();

      expect(container.firstChild).toBeNull();
    });
  });

  describe("empty cart", () => {
    it("shows empty subtitle and hides line actions", () => {
      const cart = cartWithLines([]);
      vi.spyOn(cartContext, "useCart").mockReturnValue(buildUseCartReturn({ cart }));

      renderCartPage();

      expect(screen.getByText(/Votre panier est vide/i)).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /Vider le panier/i })).not.toBeInTheDocument();
      expect(screen.queryByText(/^Total$/i)).not.toBeInTheDocument();
      expect(screen.queryByRole("list")).not.toBeInTheDocument();
    });
  });

  describe("cart with lines", () => {
    it("shows singular subtitle for one article", () => {
      const cart = cartWithLines([minimalLine({ quantity: 1, line_total: 10 })]);
      vi.spyOn(cartContext, "useCart").mockReturnValue(buildUseCartReturn({ cart }));

      renderCartPage();

      expect(screen.getByText(/1 article$/)).toBeInTheDocument();
      expect(screen.queryByText(/articles$/)).not.toBeInTheDocument();
    });

    it("shows plural subtitle when items_count is greater than one", () => {
      const cart = cartWithLines([
        minimalLine({ id: "l1", quantity: 1, line_total: 5 }),
        minimalLine({ id: "l2", sauce_id: "s2", sauce_name: "B", quantity: 2, line_total: 10 }),
      ]);
      vi.spyOn(cartContext, "useCart").mockReturnValue(buildUseCartReturn({ cart }));

      renderCartPage();

      expect(screen.getByText(/3 articles/)).toBeInTheDocument();
    });

    it("shows total from cart.total_amount", () => {
      const cart = cartWithLines([minimalLine()], { total_amount: 55.25 });
      vi.spyOn(cartContext, "useCart").mockReturnValue(buildUseCartReturn({ cart }));

      renderCartPage();

      expect(screen.getByText("Total")).toBeInTheDocument();
      expect(screen.getByText("55.25 €")).toBeInTheDocument();
    });

    it("shows clear-cart button when the cart has lines", () => {
      const cart = cartWithLines([minimalLine()]);
      vi.spyOn(cartContext, "useCart").mockReturnValue(buildUseCartReturn({ cart }));

      renderCartPage();

      expect(screen.getByRole("button", { name: /Vider le panier/i })).toBeInTheDocument();
    });

    it("requests a higher quantity when plus is pressed", async () => {
      const updateLineQuantity = vi.fn().mockResolvedValue(undefined);
      const cart = cartWithLines([minimalLine()]);
      vi.spyOn(cartContext, "useCart").mockReturnValue(buildUseCartReturn({ cart, updateLineQuantity }));

      const user = userEvent.setup();
      renderCartPage();

      await user.click(screen.getByRole("button", { name: /Augmenter la quantité de Sauce A/i }));

      expect(updateLineQuantity).toHaveBeenCalledWith("line-a", 3);
    });

    it("requests a lower quantity when minus is pressed", async () => {
      const updateLineQuantity = vi.fn().mockResolvedValue(undefined);
      const cart = cartWithLines([minimalLine({ quantity: 3 })]);
      vi.spyOn(cartContext, "useCart").mockReturnValue(buildUseCartReturn({ cart, updateLineQuantity }));

      const user = userEvent.setup();
      renderCartPage();

      await user.click(screen.getByRole("button", { name: /Diminuer la quantité de Sauce A/i }));

      expect(updateLineQuantity).toHaveBeenCalledWith("line-a", 2);
    });

    it("calls removeLine when Retirer is pressed", async () => {
      const removeLine = vi.fn().mockResolvedValue(undefined);
      const cart = cartWithLines([minimalLine()]);
      vi.spyOn(cartContext, "useCart").mockReturnValue(buildUseCartReturn({ cart, removeLine }));

      const user = userEvent.setup();
      renderCartPage();

      await user.click(screen.getByRole("button", { name: "Retirer" }));

      await waitFor(() => {
        expect(removeLine).toHaveBeenCalledWith("line-a");
      });
    });

    it("calls clearCart when Vider le panier is pressed", async () => {
      const clearCart = vi.fn().mockResolvedValue(undefined);
      const cart = cartWithLines([minimalLine()]);
      vi.spyOn(cartContext, "useCart").mockReturnValue(buildUseCartReturn({ cart, clearCart }));

      const user = userEvent.setup();
      renderCartPage();

      await user.click(screen.getByRole("button", { name: /Vider le panier/i }));

      await waitFor(() => {
        expect(clearCart).toHaveBeenCalledTimes(1);
      });
    });

    it("shows the sauce image when the line includes an image URL", () => {
      const thumb = "https://cdn.example/sauce.png";
      const cart = cartWithLines([minimalLine({ sauce_image_url: thumb })]);
      vi.spyOn(cartContext, "useCart").mockReturnValue(buildUseCartReturn({ cart }));

      const { container } = renderCartPage();

      expect(container.querySelector(`img[src="${thumb}"]`)).toBeTruthy();
    });
  });
});
