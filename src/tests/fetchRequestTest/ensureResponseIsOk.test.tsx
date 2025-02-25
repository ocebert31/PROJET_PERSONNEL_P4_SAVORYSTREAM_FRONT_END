import { describe, it, expect } from "vitest";
import { ensureResponseIsOk } from "../../services/apiRequest";

describe("ensureResponseIsOk", () => {
  describe("Success cases", () => {
    it("should do nothing if the response is OK", async () => {
      const response = { ok: true, status: 200, json: () => Promise.resolve({}) } as Response;
      await expect(ensureResponseIsOk(response)).resolves.toBeUndefined();
    });
  });

  describe("Error cases", () => {
    it("should throw an error if the response is not OK with an error message", async () => {
      const response = { ok: false, status: 500, json: () => Promise.resolve({ message: "Test error" }) } as Response;
      await expect(ensureResponseIsOk(response)).rejects.toThrow("Test error");
    });

    it("should throw a generic error if response is not OK and message is missing", async () => {
      const response = { ok: false, status: 400, json: () => Promise.resolve({}) } as Response;
      await expect(ensureResponseIsOk(response)).rejects.toThrow("Unknown error");
    });

    it("should throw an error if response is not OK and JSON parsing fails", async () => {
      const response = { ok: false, status: 500, json: () => Promise.reject(new Error("Invalid JSON")) } as Response;
      await expect(ensureResponseIsOk(response)).rejects.toThrow("Invalid JSON");
    });

    it("should throw a generic error if response is not OK and response body is empty", async () => {
      const response = { ok: false, status: 404, json: async () => { throw new Error("No body"); } } as unknown as Response;
      await expect(ensureResponseIsOk(response)).rejects.toThrow("No body");
    });
  });
});
