import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Header from "../../../components/Header/Header";
import * as authContext from "../../../context/authContext";
import * as cartContext from "../../../context/cartContext";
import type { UserPublic } from "../../../types/user";

const navigateMock = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

const adminUser: UserPublic = {
  id: "1",
  first_name: "Admin",
  last_name: "User",
  email: "admin@example.com",
  phone_number: null,
  role: "admin",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

function cartEmpty(): ReturnType<typeof cartContext.useCart> {
  return {
    cart: null,
    loadStatus: "ready",
    loadError: null,
    refreshCart: vi.fn(),
    addItem: vi.fn(),
    updateLineQuantity: vi.fn(),
    removeLine: vi.fn(),
    clearCart: vi.fn(),
  };
}

function mockVisitorAuth() {
  vi.spyOn(authContext, "useAuth").mockReturnValue({
    user: null,
    refreshUser: vi.fn(),
    logout: vi.fn(),
  });
}

function mockAdminAuth() {
  vi.spyOn(authContext, "useAuth").mockReturnValue({
    user: adminUser,
    refreshUser: vi.fn(),
    logout: vi.fn().mockResolvedValue(undefined),
  });
}

function mockCart(overrides: Partial<ReturnType<typeof cartContext.useCart>>) {
  vi.spyOn(cartContext, "useCart").mockReturnValue({
    ...cartEmpty(),
    ...overrides,
  });
}

function renderHeader() {
  render(
    <BrowserRouter>
      <Header />
    </BrowserRouter>,
  );
}

describe("Header", () => {
  beforeEach(() => {
    navigateMock.mockClear();
    mockCart({});
    mockVisitorAuth();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("landmarks", () => {
    it("exposes the main nav and the header banner for assistive tech", () => {
      renderHeader();

      expect(screen.getByRole("navigation", { name: "Navigation principale" })).toBeInTheDocument();
      expect(screen.getByRole("banner")).toBeInTheDocument();
    });
  });

  describe("when the user is a visitor", () => {
    it("points SavoryStream and Accueil to the home page", () => {
      renderHeader();

      expect(screen.getByRole("link", { name: "SavoryStream" })).toHaveAttribute("href", "/");
      expect(screen.getByRole("link", { name: "Accueil" })).toHaveAttribute("href", "/");
    });

    it("hides the dashboard entry", () => {
      renderHeader();
      expect(screen.queryByRole("link", { name: "Dashboard" })).not.toBeInTheDocument();
    });

    it("offers Inscription and Connexion", () => {
      renderHeader();

      expect(screen.getByRole("button", { name: "Inscription" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Connexion" })).toBeInTheDocument();
    });

    describe("cart control", () => {
      it('uses the label "Panier" when the cart is empty', () => {
        renderHeader();
        expect(screen.getByRole("button", { name: "Panier" })).toBeInTheDocument();
      });

      it("goes to /cart on click", async () => {
        const user = userEvent.setup();
        renderHeader();

        await user.click(screen.getByRole("button", { name: "Panier" }));

        expect(navigateMock).toHaveBeenCalledWith("/cart");
      });

      it("includes the item count in the accessible name when the cart has lines", () => {
        mockCart({
          cart: {
            id: "c",
            user_id: null,
            guest_id: "guest-1",
            items_count: 4,
            total_amount: 40,
            items: [],
          },
        });
        renderHeader();

        expect(screen.getByRole("button", { name: "Panier, 4 articles" })).toBeInTheDocument();
      });
    });
  });

  describe("when the user is an admin", () => {
    beforeEach(() => {
      mockAdminAuth();
    });

    it("keeps Accueil on / and adds Dashboard on /dashboard", () => {
      renderHeader();

      expect(screen.getByRole("link", { name: "Accueil" })).toHaveAttribute("href", "/");
      expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute("href", "/dashboard");
    });

    it("shows Déconnexion instead of Inscription / Connexion", () => {
      renderHeader();

      expect(screen.getByRole("button", { name: "Déconnexion" })).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Inscription" })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Connexion" })).not.toBeInTheDocument();
    });
  });
});
