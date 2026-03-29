import { describe, it, expect, beforeEach, vi } from "vitest";
import { postRegister, postLogin } from "../../services/authenticationService";
import { fetchRequest } from "../../services/apiRequest";
import { Mock } from "vitest";

vi.mock("../../services/apiRequest", () => ({
  fetchRequest: vi.fn(),
}));

describe("postRegister", () => {
  const mockData = {
    firstName: "Océane",
    lastName: "Martin",
    email: "oceane@example.com",
    phoneNumber: "0612345678",
    password: "supersecret",
    confirmPassword: "supersecret",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call fetchRequest with correct arguments and return the response", async () => {
    const mockResponse = {
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
    (fetchRequest as Mock).mockResolvedValue(mockResponse);

    const result = await postRegister(mockData);
    expect(fetchRequest).toHaveBeenCalledWith("users/registrations", {
      method: "POST",
      body: mockData,
    });
    expect(result).toEqual(mockResponse);
    expect(result.message).toBe("Inscription réussie.");
  });

  it("should throw an error if fetchRequest fails", async () => {
    const errorMessage = "Failed to register";
    (fetchRequest as Mock).mockRejectedValue(new Error(errorMessage));
    await expect(postRegister(mockData)).rejects.toThrow(errorMessage);
  });
});

describe("postLogin", () => {
  const mockData = { 
    email: "oceane@example.com", 
    password: "supersecret" 
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call fetchRequest with correct arguments and return the response", async () => {
    const mockResponse = { success: true, token: "jwt-token" };
    (fetchRequest as Mock).mockResolvedValue(mockResponse);

    const result = await postLogin(mockData);
    expect(fetchRequest).toHaveBeenCalledWith("users/sessions", {
      method: "POST",
      body: mockData,
    });
    expect(result).toEqual(mockResponse);
  });

  it("should throw an error if fetchRequest fails", async () => {
    const errorMessage = "Login failed";
    (fetchRequest as Mock).mockRejectedValue(new Error(errorMessage));
    await expect(postLogin(mockData)).rejects.toThrow(errorMessage);
  });
});
