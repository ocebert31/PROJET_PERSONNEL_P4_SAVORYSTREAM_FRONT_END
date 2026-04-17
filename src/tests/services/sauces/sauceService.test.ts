import { describe, it, expect, vi, beforeEach } from "vitest";
import * as authentication from "../../../services/users/authentication";
import { createSauce } from "../../../services/sauces/sauceService";
import type { SauceCreateResponse } from "../../../types/sauce";

vi.mock("../../../services/users/authentication", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../../services/users/authentication")>();
  return {
    ...actual,
    fetchSessionRequest: vi.fn(),
  };
});

function minimalCreateResponse(overrides: Partial<SauceCreateResponse> = {}): SauceCreateResponse {
  const iso = "2026-01-01T00:00:00.000Z";
  return {
    message: "Sauce créée.",
    sauce: {
      id: "sauce-new",
      name: "Test",
      tagline: "Tag",
      description: null,
      characteristic: null,
      image_url: null,
      is_available: true,
      category: null,
      stock: null,
      conditionings: [],
      ingredients: [],
      created_at: iso,
      updated_at: iso,
    },
    ...overrides,
  };
}

describe("sauceService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createSauce", () => {
    describe("nominal case", () => {
      it("posts FormData to sauces via fetchSessionRequest and returns the response", async () => {
        const payload = new FormData();
        payload.append("name", "Ma sauce");
        const response = minimalCreateResponse();
        vi.mocked(authentication.fetchSessionRequest).mockResolvedValue(response);

        const result = await createSauce(payload);

        expect(authentication.fetchSessionRequest).toHaveBeenCalledTimes(1);
        expect(authentication.fetchSessionRequest).toHaveBeenCalledWith("sauces", {
          method: "POST",
          body: payload,
        });
        expect(result).toEqual(response);
      });
    });

    describe("variations", () => {
      it("propagates rejection from fetchSessionRequest", async () => {
        const payload = new FormData();
        vi.mocked(authentication.fetchSessionRequest).mockRejectedValue(new Error("422 validation"));

        await expect(createSauce(payload)).rejects.toThrow("422 validation");
      });
    });
  });
});
