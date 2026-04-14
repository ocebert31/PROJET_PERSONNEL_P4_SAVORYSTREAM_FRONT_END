import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { triggerFetch } from "../../../services/apiRequest/triggerFetch";
import { ApiError } from "../../../services/apiRequest/apiError";
import { mockFetch } from "../../mocks/apiRequest";

describe("triggerFetch", () => {
  const baseUrl = "http://localhost_test:3000";
  const endpoint = "/test";
  const token = "fakeToken";
  const jsonBody = JSON.stringify({ test: "data" });
  const endpointUrl = `${baseUrl}${endpoint}`;

  const callTriggerFetch = (
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
    body: FormData | string | number | boolean | null | undefined,
    authToken: string | null = token,
  ) => triggerFetch(endpoint, method, authToken, body, baseUrl);

  const expectFetchCalledWith = (expected: Record<string, unknown>) => {
    expect(global.fetch).toHaveBeenCalledWith(endpointUrl, expect.objectContaining(expected));
  };

  beforeEach(() => {
    mockFetch.success();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("successful request flow", () => {
    it("returns the original Response object on success", async () => {
      const expectedResponse = {
        ok: true,
        status: 200,
        statusText: "OK",
        text: () => Promise.resolve(""),
        json: () => Promise.resolve({ success: true }),
      } as Response;
      global.fetch = vi.fn(() => Promise.resolve(expectedResponse));

      const result = await triggerFetch(endpoint, "GET", token, null, baseUrl);
      expect(result).toBe(expectedResponse);
    });

    it("calls fetch with expected config in nominal POST case", async () => {
      await callTriggerFetch("POST", jsonBody);

      expect(global.fetch).toHaveBeenCalledWith(endpointUrl, {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json; charset=UTF-8",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: jsonBody,
      });
    });

    it.each([
      [ "GET", null, undefined ],
      [ "POST", jsonBody, jsonBody ],
      [ "PUT", jsonBody, jsonBody ],
      [ "DELETE", null, undefined ],
    ] as const)("handles %s method body mapping correctly", async (method, body, expectedBody) => {
      await callTriggerFetch(method, body);

      expectFetchCalledWith({
        method,
        body: expectedBody,
        headers: expect.objectContaining({
          Accept: "application/json; charset=UTF-8",
          Authorization: `Bearer ${token}`,
        }),
      });
    });
  });

  describe("error handling", () => {
    it("rethrows fetch failures", async () => {
      mockFetch.error();
      await expect(callTriggerFetch("POST", jsonBody)).rejects.toThrow("Fetch failed");
    });

    it.each([ 400, 401, 500 ])("throws ApiError on HTTP %s", async (status) => {
      mockFetch.failure(status);
      await expect(callTriggerFetch("POST", jsonBody)).rejects.toThrow("Test error");
    });

    it("preserves HTTP status on thrown ApiError", async () => {
      mockFetch.failure(422, "Unprocessable Entity", "Validation failed");

      try {
        await callTriggerFetch("POST", jsonBody);
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).status).toBe(422);
        expect((error as ApiError).message).toBe("Validation failed");
      }
    });

    it("surfaces Rails validation messages", async () => {
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
      await expect(callTriggerFetch("POST", jsonBody)).rejects.toThrow("email: est déjà utilisé");
    });
  });

  describe("headers and body edge cases", () => {
    it.each([null, undefined])("does not add Content-Type when body is %s", async (body) => {
      await callTriggerFetch("POST", body);
      expect(global.fetch).toHaveBeenCalledWith(endpointUrl, expect.objectContaining({
        headers: expect.not.objectContaining({
          "Content-Type": expect.any(String),
        }),
      }));
    });

    it("does not add Content-Type for FormData", async () => {
      const file = new File(["test content"], "test.txt", { type: "text/plain" });
      const formData = new FormData();
      formData.append("file", file);

      await callTriggerFetch("POST", formData);

      expect(global.fetch).toHaveBeenCalledWith(endpointUrl, expect.objectContaining({
        headers: expect.not.objectContaining({
          "Content-Type": expect.any(String),
        }),
      }));
    });

    it.each([
      [false, "false"],
      [0, "0"],
    ] as const)("preserves falsy scalar payload %p", async (input, expected) => {
      await callTriggerFetch("POST", input);
      expect(global.fetch).toHaveBeenCalledWith(endpointUrl, expect.objectContaining({
        body: expected,
      }));
    });

    it("does not add Authorization header when token is null", async () => {
      await callTriggerFetch("POST", jsonBody, null);
      expect(global.fetch).toHaveBeenCalledWith(endpointUrl, expect.objectContaining({
        headers: expect.not.objectContaining({
          Authorization: expect.any(String),
        }),
      }));
    });
  });
});
