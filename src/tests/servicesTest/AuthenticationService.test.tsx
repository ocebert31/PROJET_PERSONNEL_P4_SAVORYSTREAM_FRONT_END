import { describe, it, expect, beforeEach, vi } from "vitest";
import { postRegister } from "../../services/authenticationService";
import { fetchRequest } from "../../services/apiRequest";
import { mockFetch } from "../mocks/apiRequest";
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

  it("should call fetchRequest with correct arguments", async () => {
    mockFetch.success();
    await postRegister(mockData);
    expect(fetchRequest).toHaveBeenCalledWith("/users", {
      method: "POST",
      body: mockData,
    });
  });

  it("should return the response from fetchRequest", async () => {
    const mockResponse = { success: true, userId: 123 };
    (fetchRequest as Mock).mockResolvedValue(mockResponse);
    const result = await postRegister(mockData);
    expect(result).toEqual(mockResponse);
  });

  it("should throw an error if fetchRequest fails", async () => {
    const errorMessage = "Failed to register";
    (fetchRequest as Mock).mockRejectedValue(new Error(errorMessage));
    await expect(postRegister(mockData)).rejects.toThrow(errorMessage);
  });
});
