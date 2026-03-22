import { describe, it, expect } from "vitest";
import { formatPrimaryPriceLabel } from "../../utils/saucePricing";

describe("formatPrimaryPriceLabel", () => {
  it("formats first conditionnement prix with two decimals", () => {
    expect(formatPrimaryPriceLabel({ conditionnements: [{ prix: 3.9 }] })).toBe("3.90 €");
  });

  it("returns N/A when no conditionnement", () => {
    expect(formatPrimaryPriceLabel({ conditionnements: [] })).toBe("N/A €");
  });

  it("returns N/A when prix is undefined", () => {
    expect(formatPrimaryPriceLabel({ conditionnements: [{}] })).toBe("N/A €");
  });
});
