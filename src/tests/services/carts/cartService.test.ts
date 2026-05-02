import { describe, it, expect, vi, beforeEach } from "vitest";
import * as authentication from "../../../services/users/authentication";
import {
  addCartItem,
  clearCart,
  fetchCart,
  removeCartItem,
  updateCartItemQuantity,
} from "../../../services/carts/cartService";
import type { CartMutationResponse, CartPayload, CartShowResponse } from "../../../types/cart";

vi.mock("../../../services/users/authentication", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../../services/users/authentication")>();
  return {
    ...actual,
    fetchSessionRequest: vi.fn(),
  };
});

function minimalCart(overrides: Partial<CartPayload> = {}): CartPayload {
  return {
    id: "cart-1",
    user_id: null,
    guest_id: "guest-uuid",
    items_count: 0,
    total_amount: 0,
    items: [],
    ...overrides,
  };
}

describe("cartService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("fetchCart", () => {
    describe("nominal case", () => {
      it("requests GET carts and returns the payload", async () => {
        const cart = minimalCart();
        const response: CartShowResponse = { cart };
        vi.mocked(authentication.fetchSessionRequest).mockResolvedValue(response);

        const result = await fetchCart();

        expect(authentication.fetchSessionRequest).toHaveBeenCalledTimes(1);
        expect(authentication.fetchSessionRequest).toHaveBeenCalledWith("carts", { method: "GET" });
        expect(result).toEqual(response);
      });
    });

    describe("variations", () => {
      it("propagates rejection from fetchSessionRequest", async () => {
        vi.mocked(authentication.fetchSessionRequest).mockRejectedValue(new Error("401 unauthorized"));

        await expect(fetchCart()).rejects.toThrow("401 unauthorized");
      });
    });
  });

  describe("addCartItem", () => {
    describe("nominal case", () => {
      it("posts sauce_id, conditioning_id and quantity to carts/items", async () => {
        const cart = minimalCart({ items_count: 2 });
        const response: CartMutationResponse = { message: "Article ajouté au panier.", cart };
        vi.mocked(authentication.fetchSessionRequest).mockResolvedValue(response);

        const result = await addCartItem("sauce-uuid", "conditioning-uuid", 3);

        expect(authentication.fetchSessionRequest).toHaveBeenCalledTimes(1);
        expect(authentication.fetchSessionRequest).toHaveBeenCalledWith("carts/items", {
          method: "POST",
          body: { sauce_id: "sauce-uuid", conditioning_id: "conditioning-uuid", quantity: 3 },
        });
        expect(result).toEqual(response);
      });

      it("forwards quantity as provided without normalizing", async () => {
        const response: CartMutationResponse = { message: "ok", cart: minimalCart() };
        vi.mocked(authentication.fetchSessionRequest).mockResolvedValue(response);

        await addCartItem("s1", "c1", 1);

        expect(authentication.fetchSessionRequest).toHaveBeenCalledWith("carts/items", {
          method: "POST",
          body: { sauce_id: "s1", conditioning_id: "c1", quantity: 1 },
        });
      });
    });

    describe("variations", () => {
      it("propagates rejection from fetchSessionRequest", async () => {
        vi.mocked(authentication.fetchSessionRequest).mockRejectedValue(new Error("422 invalid quantity"));

        await expect(addCartItem("s", "c", 1)).rejects.toThrow("422 invalid quantity");
      });
    });
  });

  describe("updateCartItemQuantity", () => {
    describe("nominal case", () => {
      it("patches quantity with encoded cart line id in the path", async () => {
        const lineId = "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee";
        const cart = minimalCart();
        const response: CartMutationResponse = { message: "Quantité mise à jour.", cart };
        vi.mocked(authentication.fetchSessionRequest).mockResolvedValue(response);

        const result = await updateCartItemQuantity(lineId, 5);

        expect(authentication.fetchSessionRequest).toHaveBeenCalledTimes(1);
        expect(authentication.fetchSessionRequest).toHaveBeenCalledWith(`carts/items/${encodeURIComponent(lineId)}`, {
          method: "PATCH",
          body: { quantity: 5 },
        });
        expect(result).toEqual(response);
      });

      it.each([
        {
          label: "slashes and spaces",
          lineId: "line/with slash",
          expectedPath: `carts/items/${encodeURIComponent("line/with slash")}`,
        },
        {
          label: "unicode characters",
          lineId: "ligne-été",
          expectedPath: `carts/items/${encodeURIComponent("ligne-été")}`,
        },
        {
          label: "empty string id",
          lineId: "",
          expectedPath: `carts/items/${encodeURIComponent("")}`,
        },
      ])("uses encodeURIComponent for line ids with $label", async ({ lineId, expectedPath }) => {
        const response: CartMutationResponse = { message: "ok", cart: minimalCart() };
        vi.mocked(authentication.fetchSessionRequest).mockResolvedValue(response);

        await updateCartItemQuantity(lineId, 2);

        expect(authentication.fetchSessionRequest).toHaveBeenCalledWith(expectedPath, {
          method: "PATCH",
          body: { quantity: 2 },
        });
      });
    });

    describe("variations", () => {
      it("propagates rejection from fetchSessionRequest", async () => {
        vi.mocked(authentication.fetchSessionRequest).mockRejectedValue(new Error("404 unknown line"));

        await expect(updateCartItemQuantity("missing-line", 1)).rejects.toThrow("404 unknown line");
      });
    });
  });

  describe("removeCartItem", () => {
    describe("nominal case", () => {
      it("deletes the carts/items/:id route with encoded id", async () => {
        const lineId = "rm-line-id";
        const cart = minimalCart();
        const response: CartMutationResponse = { message: "Article retiré du panier.", cart };
        vi.mocked(authentication.fetchSessionRequest).mockResolvedValue(response);

        const result = await removeCartItem(lineId);

        expect(authentication.fetchSessionRequest).toHaveBeenCalledTimes(1);
        expect(authentication.fetchSessionRequest).toHaveBeenCalledWith(`carts/items/${encodeURIComponent(lineId)}`, {
          method: "DELETE",
        });
        expect(result).toEqual(response);
      });

      it("encodes line ids that contain reserved URL characters", async () => {
        const lineId = "id%2Falready";
        const response: CartMutationResponse = { message: "ok", cart: minimalCart() };
        vi.mocked(authentication.fetchSessionRequest).mockResolvedValue(response);

        await removeCartItem(lineId);

        expect(authentication.fetchSessionRequest).toHaveBeenCalledWith(`carts/items/${encodeURIComponent(lineId)}`, {
          method: "DELETE",
        });
      });
    });

    describe("variations", () => {
      it("propagates rejection from fetchSessionRequest", async () => {
        vi.mocked(authentication.fetchSessionRequest).mockRejectedValue(new Error("410 gone"));

        await expect(removeCartItem("gone-line")).rejects.toThrow("410 gone");
      });
    });
  });

  describe("clearCart", () => {
    describe("nominal case", () => {
      it("deletes the carts collection", async () => {
        const cart = minimalCart();
        const response: CartMutationResponse = { message: "Panier vidé.", cart };
        vi.mocked(authentication.fetchSessionRequest).mockResolvedValue(response);

        const result = await clearCart();

        expect(authentication.fetchSessionRequest).toHaveBeenCalledTimes(1);
        expect(authentication.fetchSessionRequest).toHaveBeenCalledWith("carts", { method: "DELETE" });
        expect(result).toEqual(response);
      });
    });

    describe("variations", () => {
      it("propagates rejection from fetchSessionRequest", async () => {
        vi.mocked(authentication.fetchSessionRequest).mockRejectedValue(new Error("503 unavailable"));

        await expect(clearCart()).rejects.toThrow("503 unavailable");
      });
    });
  });
});
