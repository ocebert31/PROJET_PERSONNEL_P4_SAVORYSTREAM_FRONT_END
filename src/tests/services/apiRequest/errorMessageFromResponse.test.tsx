import { describe, it, expect } from "vitest";
import {
  extractRailsErrors,
  messageFromBody,
  errorMessageFromResponse,
} from "../../../services/apiRequest/errorMessageFromResponse";

describe("errorMessageFromResponse", () => {
  describe("extractRailsErrors", () => {
    it("returns joined errors in nominal case", () => {
      const errors = {
        name: [ "can't be blank" ],
        tagline: "is too short",
      };

      expect(extractRailsErrors(errors)).toBe("name: can't be blank · tagline: is too short");
    });

    it("returns null when input is not an object", () => {
      expect(extractRailsErrors(null)).toBeNull();
      expect(extractRailsErrors("invalid")).toBeNull();
      expect(extractRailsErrors([ "array" ])).toBeNull();
    });

    it("returns null when no valid messages are found", () => {
      const errors = { name: [ 1, 2 ], stock: {}, note: "   " };
      expect(extractRailsErrors(errors)).toBeNull();
    });
  });

  describe("messageFromBody", () => {
    const fallback = "Fallback message";

    it("returns string body in nominal case", () => {
      expect(messageFromBody("backend error", fallback)).toBe("backend error");
    });

    it("returns fallback for blank string", () => {
      expect(messageFromBody("   ", fallback)).toBe(fallback);
    });

    it("returns message field when present", () => {
      expect(messageFromBody({ message: "Invalid payload" }, fallback)).toBe("Invalid payload");
    });

    it("returns error field when message is missing", () => {
      expect(messageFromBody({ error: "Token expired" }, fallback)).toBe("Token expired");
    });

    it("returns formatted rails errors when message and error are missing", () => {
      expect(messageFromBody({ errors: { email: [ "is invalid" ] } }, fallback)).toBe("email: is invalid");
    });

    it("returns fallback for unsupported body values", () => {
      expect(messageFromBody(undefined, fallback)).toBe(fallback);
      expect(messageFromBody(12, fallback)).toBe(fallback);
    });
  });

  describe("errorMessageFromResponse", () => {
    it("returns message field in nominal case", async () => {
      const response = {
        statusText: "Bad Request",
        text: () => Promise.resolve(JSON.stringify({ message: "Invalid payload" })),
      } as unknown as Response;

      await expect(errorMessageFromResponse(response)).resolves.toBe("Invalid payload");
    });

    it("falls back to statusText when response body is empty", async () => {
      const response = {
        statusText: "Not Found",
        text: () => Promise.resolve("   "),
      } as unknown as Response;

      await expect(errorMessageFromResponse(response)).resolves.toBe("Not Found");
    });

    it("falls back to default message when statusText is empty", async () => {
      const response = {
        statusText: "  ",
        text: () => Promise.resolve(""),
      } as unknown as Response;

      await expect(errorMessageFromResponse(response)).resolves.toBe("Une erreur est survenue.");
    });

    it("returns raw body when JSON parsing fails", async () => {
      const response = {
        statusText: "Server Error",
        text: () => Promise.resolve("plain backend error"),
      } as unknown as Response;

      await expect(errorMessageFromResponse(response)).resolves.toBe("plain backend error");
    });

    it("falls back when reading response text throws", async () => {
      const response = {
        statusText: "Gateway Timeout",
        text: async () => {
          throw new Error("stream read failed");
        },
      } as unknown as Response;

      await expect(errorMessageFromResponse(response)).resolves.toBe("Gateway Timeout");
    });
  });
});
