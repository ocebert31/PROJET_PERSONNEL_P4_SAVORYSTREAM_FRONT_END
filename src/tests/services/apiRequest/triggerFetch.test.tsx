import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { triggerFetch } from "../../../services/apiRequest";
import { mockFetch } from "../../mocks/apiRequest";

describe("triggerFetch", () => {
  const VITE_API_URL_AUTH = "http://localhost_test:3000";

  beforeEach(() => {
    mockFetch.success();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("successCases", () => {
    it("should call fetch with correct parameters for POST method", async () => {
      await triggerFetch("/test", "POST", "fakeToken", JSON.stringify({ test: "data" }), VITE_API_URL_AUTH);

      expect(global.fetch).toHaveBeenCalledWith(`${VITE_API_URL_AUTH}/test`, {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json; charset=UTF-8",
          Authorization: "Bearer fakeToken",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ test: "data" }),
      });
    });

    it("should call fetch with correct parameters for GET method", async () => {
      await triggerFetch("/test", "GET", "fakeToken", null, VITE_API_URL_AUTH);

      expect(global.fetch).toHaveBeenCalledWith(`${VITE_API_URL_AUTH}/test`, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json; charset=UTF-8",
          Authorization: "Bearer fakeToken",
        },
      });
    });

    it("should call fetch with correct parameters for PUT method", async () => {
      await triggerFetch("/test", "PUT", "fakeToken", JSON.stringify({ test: "data" }), VITE_API_URL_AUTH);

      expect(global.fetch).toHaveBeenCalledWith(`${VITE_API_URL_AUTH}/test`, {
        method: "PUT",
        credentials: "include",
        headers: {
          Accept: "application/json; charset=UTF-8",
          Authorization: "Bearer fakeToken",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ test: "data" }),
      });
    });

    it("should call fetch with correct parameters for DELETE method", async () => {
      await triggerFetch("/test", "DELETE", "fakeToken", null, VITE_API_URL_AUTH);

      expect(global.fetch).toHaveBeenCalledWith(`${VITE_API_URL_AUTH}/test`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Accept: "application/json; charset=UTF-8",
          Authorization: "Bearer fakeToken",
        },
      });
    });

    it("should build the URL correctly for fetch", async () => {
      await triggerFetch("/test", "POST", "fakeToken", JSON.stringify({ test: "data" }), VITE_API_URL_AUTH);
      expect(global.fetch).toHaveBeenCalledWith(`${VITE_API_URL_AUTH}/test`, expect.any(Object));
    });

    it("should add the token in the Authorization header", async () => {
      await triggerFetch("/test", "POST", "fakeToken", JSON.stringify({ test: "data" }), VITE_API_URL_AUTH);
      expect(global.fetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer fakeToken",
        }),
      }));
    });
  });

  describe("errorCases", () => {
    it("should throw an error if fetch fails", async () => {
      mockFetch.error();
      await expect(triggerFetch("/test", "POST", "fakeToken", JSON.stringify({ test: "data" }), VITE_API_URL_AUTH))
        .rejects.toThrow("Fetch failed");
    });

    it("should throw an error for HTTP 400 response", async () => {
      mockFetch.failure(400);
      await expect(
        triggerFetch("/test", "POST", "fakeToken", JSON.stringify({ test: "data" }), VITE_API_URL_AUTH)
      ).rejects.toThrow("Test error");
    });

    it("should throw an error for HTTP 500 response", async () => {
      mockFetch.failure(500);
      await expect(
        triggerFetch("/test", "POST", "fakeToken", JSON.stringify({ test: "data" }), VITE_API_URL_AUTH)
      ).rejects.toThrow("Test error");
    });

    it("should include Rails-style validation errors in the thrown message", async () => {
      const body = JSON.stringify({ errors: { email: ["est déjà utilisé"] } });
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 422,
          statusText: "Unprocessable Entity",
          json: () => Promise.resolve(JSON.parse(body)),
          text: () => Promise.resolve(body),
        } as Response),
      );
      await expect(
        triggerFetch("/test", "POST", "fakeToken", JSON.stringify({ test: "data" }), VITE_API_URL_AUTH),
      ).rejects.toThrow("email: est déjà utilisé");
    });
  });

  describe("when the body is null or undefined", () => {
    it("should not add Content-Type if body is null", async () => {
      await triggerFetch("/test", "POST", "fakeToken", null, VITE_API_URL_AUTH);
      expect(global.fetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
        headers: expect.not.objectContaining({
          "Content-Type": expect.any(String),
        }),
      }));
    });

    it("should not add Content-Type if body is undefined", async () => {
      await triggerFetch("/test", "POST", "fakeToken", undefined, VITE_API_URL_AUTH);
      expect(global.fetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
        headers: expect.not.objectContaining({
          "Content-Type": expect.any(String),
        }),
      }));
    });

    it("should correctly handle a binary file in the body", async () => {
      const file = new File(["test content"], "test.txt", { type: "text/plain" });
      const formData = new FormData();
      formData.append("file", file);

      await triggerFetch("/test", "POST", "fakeToken", formData, VITE_API_URL_AUTH);
      expect(global.fetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
        headers: expect.not.objectContaining({
          "Content-Type": expect.any(String),
        }),
      }));
    });
  });

  describe("when the token expired or null", () => {
    it("should throw an error if the token is expired", async () => {
      const expiredToken = "expiredToken";
      mockFetch.failure(401);
      await expect(
        triggerFetch("/test", "POST", expiredToken, JSON.stringify({ test: "data" }), VITE_API_URL_AUTH)
      ).rejects.toThrow("Test error");
    });

    it("should not add Authorization header if token is null", async () => {
      await triggerFetch("/test", "POST", null, JSON.stringify({ test: "data" }), VITE_API_URL_AUTH);
      expect(global.fetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
        headers: expect.not.objectContaining({
          Authorization: expect.any(String),
        }),
      }));
    });
  });
});
