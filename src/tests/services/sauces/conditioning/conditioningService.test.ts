import { describe, it, expect, vi, beforeEach } from "vitest";
import * as authentication from "../../../../services/users/authentication";
import {
  createSauceConditioning,
  updateSauceConditioning,
  deleteSauceConditioning,
} from "../../../../services/sauces/conditioning/conditioningService";

vi.mock("../../../../services/users/authentication", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../../../services/users/authentication")>();
  return {
    ...actual,
    fetchSessionRequest: vi.fn(),
  };
});

describe("conditioningService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createSauceConditioning", () => {
    describe("nominal case", () => {
      it("posts collection endpoint with sauce_id, volume, and price", async () => {
        const response = {
          message: "Conditionnement créé.",
          conditioning: { id: "new-cond", volume: "750ml", price: "12.50" },
        };
        vi.mocked(authentication.fetchSessionRequest).mockResolvedValue(response);

        const result = await createSauceConditioning("sauce-id", { volume: "750ml", price: "12.50" });

        expect(authentication.fetchSessionRequest).toHaveBeenCalledWith("sauces/conditionings", {
          method: "POST",
          body: { sauce_id: "sauce-id", volume: "750ml", price: "12.50" },
        });
        expect(result).toEqual(response);
      });
    });

    describe("variations", () => {
      it("propagates rejection from fetchSessionRequest", async () => {
        vi.mocked(authentication.fetchSessionRequest).mockRejectedValue(new Error("422 validation"));

        await expect(createSauceConditioning("sauce-id", { volume: "750ml", price: "1" })).rejects.toThrow(
          "422 validation",
        );
      });
    });
  });

  describe("updateSauceConditioning", () => {
    describe("nominal case", () => {
      it("calls conditioning patch endpoint with optimistic versioning", async () => {
        const response = { message: "Conditioning updated." };
        vi.mocked(authentication.fetchSessionRequest).mockResolvedValue(response);

        const result = await updateSauceConditioning(
          "sauce-id",
          "cond-id",
          { volume: "100ml", price: 4.5 },
          { version: 8 },
        );

        expect(authentication.fetchSessionRequest).toHaveBeenCalledWith("sauces/conditionings/cond-id", {
          method: "PATCH",
          body: { volume: "100ml", price: 4.5, version: 8 },
          headers: {},
        });
        expect(result).toEqual(response);
      });
    });

    describe("variations", () => {
      it("sends If-Match header when eTag is provided", async () => {
        vi.mocked(authentication.fetchSessionRequest).mockResolvedValue({ message: "Conditioning updated." });

        await updateSauceConditioning(
          "sauce-id",
          "cond-id",
          { volume: "100ml", price: 4.5 },
          { version: 2, eTag: "\"cond-etag\"" },
        );

        expect(authentication.fetchSessionRequest).toHaveBeenCalledWith("sauces/conditionings/cond-id", {
          method: "PATCH",
          body: { volume: "100ml", price: 4.5, version: 2 },
          headers: { "If-Match": "\"cond-etag\"" },
        });
      });
    });
  });

  describe("deleteSauceConditioning", () => {
    describe("nominal case", () => {
      it("calls delete endpoint with version payload", async () => {
        const response = { message: "Conditioning deleted." };
        vi.mocked(authentication.fetchSessionRequest).mockResolvedValue(response);

        const result = await deleteSauceConditioning("sauce-id", "cond-id", { version: 5 });

        expect(authentication.fetchSessionRequest).toHaveBeenCalledWith("sauces/conditionings/cond-id", {
          method: "DELETE",
          body: { version: 5 },
          headers: {},
        });
        expect(result).toEqual(response);
      });
    });

    describe("variations", () => {
      it("sends If-Match header when only eTag is provided", async () => {
        vi.mocked(authentication.fetchSessionRequest).mockResolvedValue({ message: "Conditioning deleted." });

        await deleteSauceConditioning("sauce-id", "cond-id", { eTag: "\"w/cond\"" });

        expect(authentication.fetchSessionRequest).toHaveBeenCalledWith("sauces/conditionings/cond-id", {
          method: "DELETE",
          body: undefined,
          headers: { "If-Match": "\"w/cond\"" },
        });
      });
    });
  });
});
