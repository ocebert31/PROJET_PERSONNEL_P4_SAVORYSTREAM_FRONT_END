import { describe, it, expect } from "vitest";
import { ApiError } from "../../../services/apiRequest/apiError";

describe("ApiError", () => {
  it("creates an ApiError with message and status in nominal case", () => {
    const error = new ApiError("Unauthorized", 401);

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ApiError);
    expect(error.name).toBe("ApiError");
    expect(error.message).toBe("Unauthorized");
    expect(error.status).toBe(401);
  });

  it("keeps status and message for another HTTP code", () => {
    const error = new ApiError("Internal Server Error", 500);

    expect(error.message).toBe("Internal Server Error");
    expect(error.status).toBe(500);
  });
});
