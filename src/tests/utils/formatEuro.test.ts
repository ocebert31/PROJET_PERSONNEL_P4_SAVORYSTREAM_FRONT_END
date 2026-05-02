import { describe, expect, it } from "vitest";
import { formatEuro } from "../../utils/formatEuro";

describe("formatEuro", () => {
  it("formats amounts with two decimals and euro suffix", () => {
    expect(formatEuro(0)).toBe("0.00 €");
    expect(formatEuro(12.5)).toBe("12.50 €");
    expect(formatEuro(99.999)).toBe("100.00 €");
  });
});
