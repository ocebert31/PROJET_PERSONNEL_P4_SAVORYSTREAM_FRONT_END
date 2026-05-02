import type { ComponentProps } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CartAction from "../../../components/Cart/CartAction";
import * as cartContext from "../../../context/cartContext";
import type { CartPayload } from "../../../types/cart";

const navigateMock = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

function navLinkClassFromRoute({ isActive }: { isActive: boolean }) {
  return isActive ? "active" : "inactive";
}

function buildCartPayload(overrides: Partial<CartPayload> = {}): CartPayload {
  return {
    id: "c",
    user_id: null,
    guest_id: "g",
    items_count: 0,
    total_amount: 0,
    items: [],
    ...overrides,
  };
}

function mockUseCart(overrides: { cart?: CartPayload | null } & Partial<Omit<ReturnType<typeof cartContext.useCart>, "cart">>) {
  const {
    cart: cartOverride,
    ...rest
  } = overrides;
  const base: ReturnType<typeof cartContext.useCart> = {
    cart: buildCartPayload(),
    loadStatus: "ready",
    loadError: null,
    refreshCart: vi.fn(),
    addItem: vi.fn(),
    updateLineQuantity: vi.fn(),
    removeLine: vi.fn(),
    clearCart: vi.fn(),
    ...rest,
  };
  if (cartOverride !== undefined) {
    base.cart = cartOverride;
  }
  vi.spyOn(cartContext, "useCart").mockReturnValue(base);
}

function renderCartAction(
  options: { initialPath?: string; navLinkClass?: ComponentProps<typeof CartAction>["navLinkClass"] } = {},
) {
  const { initialPath = "/", navLinkClass = navLinkClassFromRoute } = options;
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <CartAction navLinkClass={navLinkClass} />
    </MemoryRouter>,
  );
}

describe("CartAction", () => {
  beforeEach(() => {
    navigateMock.mockClear();
    mockUseCart({});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("label and badge", () => {
    it('uses "Panier" when the cart is empty or null', () => {
      mockUseCart({ cart: null });
      renderCartAction();

      expect(screen.getByRole("button", { name: "Panier" })).toBeInTheDocument();
    });

    it("shows no numeric badge when count is zero", () => {
      renderCartAction();

      expect(screen.queryByText("99+")).not.toBeInTheDocument();
      expect(screen.queryByText(/^3$/)).not.toBeInTheDocument();
    });

    it("reflects the line count in the accessible name and badge", () => {
      mockUseCart({ cart: buildCartPayload({ items_count: 3, total_amount: 30 }) });
      renderCartAction();

      expect(screen.getByRole("button", { name: "Panier, 3 articles" })).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
    });

    it('shows "99+" in the badge when count exceeds 99', () => {
      mockUseCart({ cart: buildCartPayload({ items_count: 150 }) });
      renderCartAction();

      expect(screen.getByRole("button", { name: "Panier, 150 articles" })).toBeInTheDocument();
      expect(screen.getByText("99+")).toBeInTheDocument();
    });
  });

  describe("navigation", () => {
    it("calls navigate with /cart when clicked", async () => {
      const user = userEvent.setup();
      renderCartAction();

      await user.click(screen.getByRole("button", { name: "Panier" }));

      expect(navigateMock).toHaveBeenCalledWith("/cart");
    });
  });

  describe("navLinkClass (active route)", () => {
    it("passes isActive true when the router path is /cart", () => {
      renderCartAction({ initialPath: "/cart" });

      expect(screen.getByRole("button", { name: "Panier" })).toHaveClass("active");
    });

    it("passes isActive false on other routes", () => {
      renderCartAction({ initialPath: "/sauces" });

      expect(screen.getByRole("button", { name: "Panier" })).toHaveClass("inactive");
    });

    it("merges a string className with IconButton layout classes", () => {
      renderCartAction({ navLinkClass: "custom-nav-class" });

      const btn = screen.getByRole("button", { name: "Panier" });
      expect(btn).toHaveClass("custom-nav-class");
      expect(btn.className).toContain("min-h-11");
    });
  });
});
