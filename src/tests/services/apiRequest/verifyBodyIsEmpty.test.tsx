import { describe, it, expect } from "vitest";
import { verifyBodyIsEmpty } from "../../../services/apiRequest/verifyBodyIsEmpty";

describe("verifyBodyIsEmpty", () => {
  it("does not throw in nominal case when body is a valid object", () => {
    expect(() => verifyBodyIsEmpty({ key: "value" })).not.toThrow();
  });

  it("throws when body is an empty string", () => {
    expect(() => verifyBodyIsEmpty("")).toThrow("Request body cannot be empty");
  });

  it("does not throw for null, undefined, false, and 0", () => {
    expect(() => verifyBodyIsEmpty(null)).not.toThrow();
    expect(() => verifyBodyIsEmpty(undefined)).not.toThrow();
    expect(() => verifyBodyIsEmpty(false)).not.toThrow();
    expect(() => verifyBodyIsEmpty(0)).not.toThrow();
  });
});
