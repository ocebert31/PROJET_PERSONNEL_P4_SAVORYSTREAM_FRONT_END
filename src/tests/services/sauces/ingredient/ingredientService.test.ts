import { describe, it, expect, vi, beforeEach } from "vitest";
import * as authentication from "../../../../services/users/authentication";
import {
  createSauceIngredient,
  updateSauceIngredient,
  deleteSauceIngredient,
} from "../../../../services/sauces/ingredient/ingredientService";

vi.mock("../../../../services/users/authentication", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../../../services/users/authentication")>();
  return {
    ...actual,
    fetchSessionRequest: vi.fn(),
  };
});

describe("ingredientService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createSauceIngredient", () => {
    describe("nominal case", () => {
      it("posts collection endpoint with sauce_id, name, and quantity", async () => {
        const response = {
          message: "Ingrédient créé.",
          ingredient: { id: "new-ing", name: "Vinaigre", quantity: "5%" },
        };
        vi.mocked(authentication.fetchSessionRequest).mockResolvedValue(response);

        const result = await createSauceIngredient("sauce-id", { name: "Vinaigre", quantity: "5%" });

        expect(authentication.fetchSessionRequest).toHaveBeenCalledWith("sauces/ingredients", {
          method: "POST",
          body: { sauce_id: "sauce-id", name: "Vinaigre", quantity: "5%" },
        });
        expect(result).toEqual(response);
      });
    });

    describe("variations", () => {
      it("propagates rejection from fetchSessionRequest", async () => {
        vi.mocked(authentication.fetchSessionRequest).mockRejectedValue(new Error("403 forbidden"));
        await expect(createSauceIngredient("sauce-id", { name: "X", quantity: "1%" })).rejects.toThrow("403 forbidden");
      });
    });
  });

  describe("updateSauceIngredient", () => {
    describe("nominal case", () => {
      it("calls ingredient patch endpoint with If-Match header", async () => {
        const response = { message: "Ingredient updated." };
        vi.mocked(authentication.fetchSessionRequest).mockResolvedValue(response);

        const result = await updateSauceIngredient(
          "sauce-id",
          "ing-id",
          { name: "pepper", quantity: "20g" },
          { eTag: "\"v10\"" },
        );

        expect(authentication.fetchSessionRequest).toHaveBeenCalledWith("sauces/ingredients/ing-id", {
          method: "PATCH",
          body: { name: "pepper", quantity: "20g" },
          headers: { "If-Match": "\"v10\"" },
        });
        expect(result).toEqual(response);
      });
    });

    describe("variations", () => {
      it("includes version in the body when provided", async () => {
        vi.mocked(authentication.fetchSessionRequest).mockResolvedValue({ message: "Ingredient updated." });

        await updateSauceIngredient("sauce-id", "ing-id", { name: "salt", quantity: "1g" }, { version: 4 });

        expect(authentication.fetchSessionRequest).toHaveBeenCalledWith("sauces/ingredients/ing-id", {
          method: "PATCH",
          body: { name: "salt", quantity: "1g", version: 4 },
          headers: {},
        });
      });
    });
  });

  describe("deleteSauceIngredient", () => {
    describe("nominal case", () => {
      it("calls ingredient delete endpoint without body when no version is provided", async () => {
        const response = { message: "Ingredient deleted." };
        vi.mocked(authentication.fetchSessionRequest).mockResolvedValue(response);

        const result = await deleteSauceIngredient("sauce-id", "ing-id");

        expect(authentication.fetchSessionRequest).toHaveBeenCalledWith("sauces/ingredients/ing-id", {
          method: "DELETE",
          body: undefined,
          headers: {},
        });
        expect(result).toEqual(response);
      });
    });

    describe("variations", () => {
      it("sends version in body when provided", async () => {
        vi.mocked(authentication.fetchSessionRequest).mockResolvedValue({ message: "Ingredient deleted." });

        await deleteSauceIngredient("sauce-id", "ing-id", { version: 9 });

        expect(authentication.fetchSessionRequest).toHaveBeenCalledWith("sauces/ingredients/ing-id", {
          method: "DELETE",
          body: { version: 9 },
          headers: {},
        });
      });
    });
  });
});
