import { describe, it, expect } from "vitest";
import { ApiError, isVersionConflictApiError } from "../../../services/apiRequest/apiError";

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

describe("isVersionConflictApiError", () => {
  it.each([409, 412] as const)("returns true for ApiError with status %s", (status) => {
    expect(isVersionConflictApiError(new ApiError("Conflict", status))).toBe(true);
  });

  it("returns false for ApiError with other status codes", () => {
    expect(isVersionConflictApiError(new ApiError("Bad Request", 400))).toBe(false);
    expect(isVersionConflictApiError(new ApiError("Not Found", 404))).toBe(false);
  });

  it("returns false for non-ApiError values", () => {
    expect(isVersionConflictApiError(new Error("oops"))).toBe(false);
    expect(isVersionConflictApiError(null)).toBe(false);
    expect(isVersionConflictApiError("409")).toBe(false);
  });
});
