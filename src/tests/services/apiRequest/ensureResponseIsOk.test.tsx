import { describe, it, expect } from "vitest";
import { ensureResponseIsOk } from "../../../services/apiRequest";

describe("ensureResponseIsOk", () => {
  describe("Success cases", () => {
    it("should do nothing if the response is OK", async () => {
      const response = { ok: true, status: 200, json: () => Promise.resolve({}) } as unknown as Response;
      await expect(ensureResponseIsOk(response)).resolves.toBeUndefined();
    });
  });

  describe("Error cases", () => {
    it("should throw an error if the response is not OK with an error message", async () => {
      const body = JSON.stringify({ message: "Test error" });
      const response = {
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        text: () => Promise.resolve(body),
      } as unknown as Response;
      await expect(ensureResponseIsOk(response)).rejects.toThrow("Test error");
    });

    it("should fall back to statusText if JSON has no extractable message", async () => {
      const body = JSON.stringify({});
      const response = {
        ok: false,
        status: 400,
        statusText: "Bad Request",
        text: () => Promise.resolve(body),
      } as unknown as Response;
      await expect(ensureResponseIsOk(response)).rejects.toThrow("Bad Request");
    });

    it("should surface raw body when JSON is invalid", async () => {
      const response = {
        ok: false,
        status: 500,
        statusText: "Error",
        text: () => Promise.resolve("not valid json {"),
      } as unknown as Response;
      await expect(ensureResponseIsOk(response)).rejects.toThrow("not valid json {");
    });

    it("should fall back to statusText when body read fails", async () => {
      const response = {
        ok: false,
        status: 404,
        statusText: "Not Found",
        text: async () => {
          throw new Error("No body");
        },
      } as unknown as Response;
      await expect(ensureResponseIsOk(response)).rejects.toThrow("Not Found");
    });
  });
});
