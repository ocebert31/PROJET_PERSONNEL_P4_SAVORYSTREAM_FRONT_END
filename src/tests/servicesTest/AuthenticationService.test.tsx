import { describe, it, expect, beforeEach, vi } from "vitest";
import { postRegister, postLogin } from "../../services/authenticationService";
import { fetchRequest } from "../../services/apiRequest";
import { Mock } from "vitest";

vi.mock("../../services/apiRequest", () => ({
  fetchRequest: vi.fn(),
}));

describe("postRegister", () => {
  const mockData = {
    email: "oceane@example.com",
    password: "supersecret",
    confirmPassword: "supersecret"
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call fetchRequest with correct arguments and return the response", async () => {
    const mockResponse = { success: true, userId: 123 };
    (fetchRequest as Mock).mockResolvedValue(mockResponse);

    const result = await postRegister(mockData);
    expect(fetchRequest).toHaveBeenCalledWith("/users", {
      method: "POST",
      body: mockData,
    });
    expect(result).toEqual(mockResponse);
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
    expect(fetchRequest).toHaveBeenCalledWith("/sessions", {
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
