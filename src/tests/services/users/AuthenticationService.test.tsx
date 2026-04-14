import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import * as authenticationService from "../../../services/users/authentication";
import { ApiError } from "../../../services/apiRequest/apiError";
import { fetchRequest } from "../../../services/apiRequest/fetchRequest";

vi.mock("../../../services/apiRequest/fetchRequest", () => ({
  fetchRequest: vi.fn(),
}));

describe("authentication service", () => {
  const fetchRequestMock = vi.mocked(fetchRequest);

  const registerData = {
    firstName: "Océane",
    lastName: "Martin",
    email: "oceane@example.com",
    phoneNumber: "0612345678",
    password: "supersecret",
    confirmPassword: "supersecret",
  };

  const loginData = {
    email: "oceane@example.com",
    password: "supersecret",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("postRegister", () => {
    it("calls fetchRequest and returns response in nominal case", async () => {
      const response = {
        message: "Inscription réussie.",
        user: {
          id: "550e8400-e29b-41d4-a716-446655440000",
          first_name: "Océane",
          last_name: "Martin",
          email: "oceane@example.com",
          phone_number: "0612345678",
          role: "customer",
          created_at: "2026-01-01T00:00:00.000Z",
          updated_at: "2026-01-01T00:00:00.000Z",
        },
      };
      fetchRequestMock.mockResolvedValue(response);

      const result = await authenticationService.postRegister(registerData);

      expect(fetchRequestMock).toHaveBeenCalledWith("users/registrations", {
        method: "POST",
        body: registerData,
      });
      expect(result).toEqual(response);
    });

    it("rethrows errors from fetchRequest", async () => {
      fetchRequestMock.mockRejectedValue(new Error("Failed to register"));
      await expect(authenticationService.postRegister(registerData)).rejects.toThrow("Failed to register");
    });
  });

  describe("postLogin", () => {
    it("calls fetchRequest and returns response in nominal case", async () => {
      const response = { message: "Connexion réussie.", access_token: "token" };
      fetchRequestMock.mockResolvedValue(response);

      const result = await authenticationService.postLogin(loginData);

      expect(fetchRequestMock).toHaveBeenCalledWith("users/sessions", {
        method: "POST",
        body: loginData,
      });
      expect(result).toEqual(response);
    });

    it("rethrows errors from fetchRequest", async () => {
      fetchRequestMock.mockRejectedValue(new Error("Login failed"));
      await expect(authenticationService.postLogin(loginData)).rejects.toThrow("Login failed");
    });
  });

  describe("refreshAccessToken", () => {
    it("calls refresh endpoint and returns response in nominal case", async () => {
      const response = { access_token: "new-token" };
      fetchRequestMock.mockResolvedValue(response);

      const result = await authenticationService.refreshAccessToken();

      expect(fetchRequestMock).toHaveBeenCalledWith("users/sessions/refresh", {
        method: "POST",
        body: {},
      });
      expect(result).toEqual(response);
    });

    it("rethrows errors from fetchRequest", async () => {
      fetchRequestMock.mockRejectedValue(new Error("Refresh failed"));
      await expect(authenticationService.refreshAccessToken()).rejects.toThrow("Refresh failed");
    });
  });

  describe("fetchSessionRequest", () => {
    it("returns first request result in nominal case", async () => {
      fetchRequestMock.mockResolvedValue({ ok: true });

      const result = await authenticationService.fetchSessionRequest("users/sessions/me", { method: "GET" });

      expect(fetchRequestMock).toHaveBeenCalledTimes(1);
      expect(fetchRequestMock).toHaveBeenCalledWith("users/sessions/me", { method: "GET", token: null });
      expect(result).toEqual({ ok: true });
    });

    it("retries once after 401 by refreshing token", async () => {
      fetchRequestMock
        .mockRejectedValueOnce(new ApiError("Unauthorized", 401))
        .mockResolvedValueOnce({ access_token: "new-token" })
        .mockResolvedValueOnce({ user: { id: "1" } });

      const result = await authenticationService.fetchSessionRequest("users/sessions/me", { method: "GET" });

      expect(fetchRequestMock).toHaveBeenCalledTimes(3);
      expect(fetchRequestMock).toHaveBeenNthCalledWith(1, "users/sessions/me", { method: "GET", token: null });
      expect(fetchRequestMock).toHaveBeenNthCalledWith(2, "users/sessions/refresh", {
        method: "POST",
        body: {},
      });
      expect(fetchRequestMock).toHaveBeenNthCalledWith(3, "users/sessions/me", { method: "GET", token: null });
      expect(result).toEqual({ user: { id: "1" } });
    });

    it("rethrows non-401 errors without retry", async () => {
      fetchRequestMock.mockRejectedValue(new ApiError("Forbidden", 403));

      await expect(authenticationService.fetchSessionRequest("users/sessions/me", { method: "GET" })).rejects.toThrow(
        "Forbidden",
      );
      expect(fetchRequestMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("bootstrapSession", () => {
    it("returns true in nominal case when refresh succeeds", async () => {
      fetchRequestMock.mockResolvedValue({ access_token: "new-token" });
      await expect(authenticationService.bootstrapSession()).resolves.toBe(true);
    });

    it("returns false when refresh fails", async () => {
      fetchRequestMock.mockRejectedValue(new Error("expired"));
      await expect(authenticationService.bootstrapSession()).resolves.toBe(false);
    });
  });

  describe("revokeAndClear", () => {
    it("calls revoke endpoint in nominal case", async () => {
      fetchRequestMock.mockResolvedValue({ ok: true });

      await authenticationService.revokeAndClear();

      expect(fetchRequestMock).toHaveBeenCalledWith("users/sessions/revoke", {
        method: "POST",
        body: {},
      });
    });

    it("swallows errors as best-effort behavior", async () => {
      fetchRequestMock.mockRejectedValue(new Error("network down"));
      await expect(authenticationService.revokeAndClear()).resolves.toBeUndefined();
    });
  });

  describe("fetchCurrentUser", () => {
    it("returns user in nominal case", async () => {
      fetchRequestMock.mockResolvedValue({
        user: { id: "1", email: "john@example.com" },
      });

      const user = await authenticationService.fetchCurrentUser();
      expect(user).toEqual({ id: "1", email: "john@example.com" });
    });

    it("returns null when request fails", async () => {
      fetchRequestMock.mockRejectedValue(new Error("unauthorized"));
      await expect(authenticationService.fetchCurrentUser()).resolves.toBeNull();
    });
  });
});
