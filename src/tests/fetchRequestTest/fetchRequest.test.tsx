import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { fetchRequest } from "../../services/apiRequest";
import { mockFetch } from "../mocks/apiRequest";

describe("fetchRequest", () => {
    beforeEach(() => {
        mockFetch.success()
    });
  
    afterEach(() => {
        vi.restoreAllMocks();
    });
  
    it("should make an API call and return data", async () => {
        const data = await fetchRequest("/test", { method: "GET", token: "fakeToken" });
        expect(data).toEqual({ success: true });
    });

    it("should throw an error if the request fails", async () => {
        mockFetch.failure()
        await expect(fetchRequest("/test", { method: "GET" })).rejects.toThrow("Test error");
    });

  
    it("should throw an error if the request body is empty", async () => {
      await expect(fetchRequest("/test", { method: "POST", body: "" })).rejects.toThrow("Request body cannot be empty");
    }); 

    it("should throw an error if the response is not valid JSON", async () => {
        mockFetch.invalidJson()
        await expect(fetchRequest("/invalid-json", { method: "GET", token: "fakeToken" })).rejects.toThrow("Invalid JSON");
    });
});