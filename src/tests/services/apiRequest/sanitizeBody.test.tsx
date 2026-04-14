import { describe, it, expect } from "vitest";
import { sanitizeBody } from "../../../services/apiRequest/sanitizeBody";

describe("sanitizeBody", () => {
  it("returns FormData unchanged in nominal multipart case", () => {
    const formData = new FormData();
    formData.append("name", "Sriracha");
    expect(sanitizeBody(formData)).toBe(formData);
  });

  it.each([
    [null, null],
    [true, true],
    [false, false],
    ["simple text", "simple text"],
    [{}, "{}"],
    [[1, 2, 3], "[1,2,3]"],
    [123, 123],
    [{ user: { name: "Alice", age: 25 } }, JSON.stringify({ user: { name: "Alice", age: 25 } })],
    [undefined, undefined],
  ])(`should return value %p sanitized to %p`, 
    (input, expected) => {
      expect(sanitizeBody(input)).toStrictEqual(expected);
    }
  );

  it("does not mutate object inputs", () => {
    const input = { user: { name: "Alice", age: 25 } };
    const snapshot = JSON.stringify(input);
    sanitizeBody(input);
    expect(JSON.stringify(input)).toBe(snapshot);
  });
});
