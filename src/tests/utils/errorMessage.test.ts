import { describe, expect, it } from "vitest";
import { ApiError } from "../../services/apiRequest/apiError";
import { toErrorMessage } from "../../utils/errorMessage";

describe("toErrorMessage", () => {
  it("returns ApiError message", () => {
    expect(toErrorMessage(new ApiError("Service indisponible", 503), "Fallback")).toBe("Service indisponible");
  });

  it("returns native Error message", () => {
    expect(toErrorMessage(new Error("Réseau coupé"), "Fallback")).toBe("Réseau coupé");
  });

  it("returns fallback message for non-error values", () => {
    expect(toErrorMessage("plain-string-failure", "Fallback")).toBe("Fallback");
    expect(toErrorMessage(null, "Fallback")).toBe("Fallback");
  });
});
