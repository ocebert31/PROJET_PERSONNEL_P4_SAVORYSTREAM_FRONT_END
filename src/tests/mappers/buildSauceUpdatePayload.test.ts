import { describe, expect, it } from "vitest";
import { buildSauceUpdatePayload, normalizeString } from "../../mappers/buildSauceUpdatePayload";

describe("normalizeString", () => {
  describe("nominal case", () => {
    it("returns a trimmed string when value contains non-space characters", () => {
      expect(normalizeString("  spicy  ")).toBe("spicy");
    });
  });

  describe("variations", () => {
    it("returns null when value is null", () => {
      expect(normalizeString(null)).toBeNull();
    });

    it("returns undefined when value is undefined", () => {
      expect(normalizeString(undefined)).toBeUndefined();
    });

    it("returns null when value is only spaces", () => {
      expect(normalizeString("   ")).toBeNull();
    });
  });
});

describe("buildSauceUpdatePayload", () => {
  describe("nominal case", () => {
    it("trims string fields and keeps provided primitive values", () => {
      const payload = buildSauceUpdatePayload({
        name: "  Sauce update  ",
        tagline: "  New tagline  ",
        description: "  New description  ",
        characteristic: "  Hot  ",
        category_id: "  cat-42  ",
        stock_quantity: 12,
        is_available: false,
        version: 7,
      });

      expect(payload).toEqual({
        name: "Sauce update",
        tagline: "New tagline",
        description: "New description",
        characteristic: "Hot",
        category_id: "cat-42",
        stock_quantity: 12,
        is_available: false,
        version: 7,
      });
    });
  });

  describe("variations", () => {
    it("returns an empty object when no field is provided", () => {
      expect(buildSauceUpdatePayload({})).toEqual({});
    });

    it("maps blank optional text fields to null", () => {
      const payload = buildSauceUpdatePayload({
        description: "   ",
        characteristic: "   ",
        category_id: "   ",
      });

      expect(payload).toEqual({
        description: null,
        characteristic: null,
        category_id: null,
      });
    });

    it("keeps name and tagline as empty strings when only spaces are provided", () => {
      const payload = buildSauceUpdatePayload({
        name: "   ",
        tagline: "   ",
      });

      expect(payload).toEqual({
        name: "",
        tagline: "",
      });
    });
  });
});
