import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { fetchRequest } from "../../../services/apiRequest/fetchRequest";
import { sanitizeBody } from "../../../services/apiRequest/sanitizeBody";
import { triggerFetch } from "../../../services/apiRequest/triggerFetch";
import { verifyBodyIsEmpty } from "../../../services/apiRequest/verifyBodyIsEmpty";

vi.mock("../../../services/apiRequest/sanitizeBody", () => ({
  sanitizeBody: vi.fn(),
}));

vi.mock("../../../services/apiRequest/triggerFetch", () => ({
  triggerFetch: vi.fn(),
}));

vi.mock("../../../services/apiRequest/verifyBodyIsEmpty", () => ({
  verifyBodyIsEmpty: vi.fn(),
}));

describe("fetchRequest", () => {
  const verifyBodyIsEmptyMock = vi.mocked(verifyBodyIsEmpty);
  const sanitizeBodyMock = vi.mocked(sanitizeBody);
  const triggerFetchMock = vi.mocked(triggerFetch);

  beforeEach(() => {
    verifyBodyIsEmptyMock.mockReturnValue(undefined);
    sanitizeBodyMock.mockReturnValue('{"name":"test"}');
    triggerFetchMock.mockResolvedValue({
      status: 200,
      json: () => Promise.resolve({ success: true }),
    } as Response);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("successful request flow", () => {
    it("calls collaborators and returns parsed response data", async () => {
      const data = await fetchRequest("/test", {
        method: "POST",
        body: { name: "test" },
        token: "fakeToken",
        url: "http://localhost:3000/api/v1",
      });

      expect(verifyBodyIsEmptyMock).toHaveBeenCalledWith({ name: "test" });
      expect(sanitizeBodyMock).toHaveBeenCalledWith({ name: "test" });
      expect(triggerFetchMock).toHaveBeenCalledWith(
        "/test",
        "POST",
        "fakeToken",
        '{"name":"test"}',
        "http://localhost:3000/api/v1",
      );
      expect(data).toEqual({ success: true });
    });
  });

  describe("error handling and edge cases", () => {
    it("returns undefined for a 204 no-content response", async () => {
      triggerFetchMock.mockResolvedValue({
        status: 204,
        json: () => Promise.resolve({ shouldNotBeUsed: true }),
      } as Response);

      await expect(fetchRequest("/test", { method: "DELETE", token: "fakeToken", url: "http://localhost" }))
        .resolves.toBeUndefined();
    });

    it("rethrows errors from triggerFetch", async () => {
      triggerFetchMock.mockRejectedValue(new Error("Test error"));
      await expect(fetchRequest("/test", { method: "GET", url: "http://localhost" })).rejects.toThrow("Test error");
    });

    it("rethrows validation errors from verifyBodyIsEmpty", async () => {
      verifyBodyIsEmptyMock.mockImplementation(() => {
        throw new Error("Request body cannot be empty");
      });

      await expect(fetchRequest("/test", { method: "POST", body: "", url: "http://localhost" })).rejects.toThrow(
        "Request body cannot be empty",
      );
    });

    it("throws when response body is invalid JSON", async () => {
      triggerFetchMock.mockResolvedValue({
        status: 200,
        json: () => Promise.reject(new Error("Invalid JSON")),
      } as Response);

      await expect(fetchRequest("/invalid-json", { method: "GET", token: "fakeToken", url: "http://localhost" }))
        .rejects.toThrow("Invalid JSON");
    });

    it("throws when base URL is missing", async () => {
      await expect(fetchRequest("/test", { method: "GET", url: "" })).rejects.toThrow("API base URL is missing");
    });
  });
});