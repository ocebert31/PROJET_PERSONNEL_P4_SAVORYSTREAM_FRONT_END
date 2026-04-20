import { describe, it, expect } from "vitest";
import { parsePriceToNumber, resolveImageUrl, sauceMapper } from "../../mappers/sauce.mapper";
import type { SauceApiSerialized } from "../../types/sauce";

function minimalApiSauce(
  overrides: Partial<SauceApiSerialized> & Pick<SauceApiSerialized, "id" | "name">
): SauceApiSerialized {
  const imageUrl = overrides.image_url === undefined ? "/img.png" : overrides.image_url;
  return {
    id: overrides.id,
    name: overrides.name,
    tagline: overrides.tagline ?? "Tagline",
    description: overrides.description ?? "Description",
    characteristic: overrides.characteristic ?? "Caractere",
    image_url: imageUrl,
    is_available: overrides.is_available ?? true,
    category: overrides.category ?? null,
    stock: overrides.stock ?? null,
    conditionings: overrides.conditionings ?? [{ id: "c1", volume: "250ml", price: "3.99" }],
    ingredients: overrides.ingredients ?? [{ id: "i1", name: "Tomate", quantity: "20g" }],
    created_at: overrides.created_at ?? "2026-01-01T00:00:00.000Z",
    updated_at: overrides.updated_at ?? "2026-01-01T00:00:00.000Z",
  };
}

describe("parsePriceToNumber", () => {
  describe("nominal case", () => {
    it("returns a number parsed from a valid decimal string", () => {
      expect(parsePriceToNumber("6.90")).toBe(6.9);
    });
  });

  describe("variations", () => {
    it("returns zero when price is an empty string", () => {
      expect(parsePriceToNumber("")).toBe(0);
    });

    it("returns zero when price is not numeric", () => {
      expect(parsePriceToNumber("abc")).toBe(0);
    });

    it("keeps integer values as numbers", () => {
      expect(parsePriceToNumber("7")).toBe(7);
    });
  });
});

describe("resolveImageUrl", () => {
  describe("nominal case", () => {
    it("returns provided image url when value is non-empty", () => {
      expect(resolveImageUrl("/custom.jpg")).toBe("/custom.jpg");
    });
  });

  describe("variations", () => {
    it("returns fallback image when value is null", () => {
      expect(resolveImageUrl(null)).toBe("/assets/bbq.jpg");
    });

    it("returns fallback image when value is blank", () => {
      expect(resolveImageUrl("   ")).toBe("/assets/bbq.jpg");
    });
  });
});

describe("sauceMapper", () => {
  describe("nominal case", () => {
    it("maps API payload to UI sauce model", () => {
      const api = minimalApiSauce({
        id: "s1",
        name: "Sauce Barbecue",
        tagline: "Top sauce",
        description: "Description complete",
        characteristic: "Epicée",
        image_url: "/barbecue.jpg",
        conditionings: [
          { id: "c1", volume: "250ml", price: "3.99" },
          { id: "c2", volume: "500ml", price: "6.50" },
        ],
        ingredients: [
          { id: "i1", name: "Tomate", quantity: "200g" },
          { id: "i2", name: "Paprika", quantity: "5g" },
        ],
      });

      const result = sauceMapper(api);

      expect(result).toEqual({
        id: "s1",
        name: "Sauce Barbecue",
        description: "Description complete",
        caracteristique: "Epicée",
        is_available: true,
        image_url: "/barbecue.jpg",
        accroche: "Top sauce",
        conditionnements: [
          { id: "c1", volume: "250ml", prix: 3.99 },
          { id: "c2", volume: "500ml", prix: 6.5 },
        ],
        ingredients: [
          { id: "i1", name: "Tomate", quantité: "200g" },
          { id: "i2", name: "Paprika", quantité: "5g" },
        ],
      });
    });
  });

  describe("variations", () => {
    it("trims description and characteristic and removes blank values", () => {
      const api = minimalApiSauce({
        id: "s4",
        name: "Trim fields",
        description: "  Description trimmee  ",
        characteristic: "   ",
      });

      const result = sauceMapper(api);

      expect(result.description).toBe("Description trimmee");
      expect(result.caracteristique).toBeUndefined();
    });

    it("uses fallback image when API image is null", () => {
      const api = minimalApiSauce({ id: "s2", name: "No image", image_url: null });
      const result = sauceMapper(api);
      expect(result.image_url).toBe("/assets/bbq.jpg");
    });

    it("uses fallback image when API image is blank", () => {
      const api = minimalApiSauce({ id: "s3", name: "Blank image", image_url: "   " });
      const result = sauceMapper(api);
      expect(result.image_url).toBe("/assets/bbq.jpg");
    });

    it("removes blank tagline from accroche", () => {
      const api = minimalApiSauce({ id: "s5", name: "No tagline", tagline: "   " });
      const result = sauceMapper(api);
      expect(result.accroche).toBeUndefined();
    });

    it("maps invalid price strings to zero", () => {
      const api = minimalApiSauce({
        id: "s7",
        name: "Invalid prices",
        conditionings: [
          { id: "c1", volume: "250ml", price: "bad-price" },
          { id: "c2", volume: "500ml", price: "" },
        ],
      });

      const result = sauceMapper(api);
      expect(result.conditionnements).toEqual([
        { id: "c1", volume: "250ml", prix: 0 },
        { id: "c2", volume: "500ml", prix: 0 },
      ]);
    });

    it("maps empty ingredients list to undefined", () => {
      const api = minimalApiSauce({ id: "s6", name: "No ingredients", ingredients: [] });
      const result = sauceMapper(api);
      expect(result.ingredients).toBeUndefined();
    });
  });
});


