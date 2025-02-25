import { describe, it, expect } from "vitest";
import { sanitizeBody } from "../../services/apiRequest";

describe("sanitizeBody", () => {
  it.each([
    [{ test: "value" }, JSON.stringify({ test: "value" })],
    [new FormData(), expect.any(FormData)],
    [null, null],
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
});
