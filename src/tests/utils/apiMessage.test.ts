import { describe, it, expect } from "vitest";
import { extractSuccessMessage } from "../../utils/apiMessage";

describe("extractSuccessMessage", () => {
    it("returns trimmed message when message key is a non-empty string", () => {
        expect(extractSuccessMessage({ message: "  OK  " }, "fallback")).toBe("OK");
    });

    it("returns fallback when message key is missing", () => {
        expect(extractSuccessMessage({ foo: 1 }, "fb")).toBe("fb");
    });

    it("returns fallback when message is empty or whitespace-only", () => {
        expect(extractSuccessMessage({ message: "" }, "fb")).toBe("fb");
        expect(extractSuccessMessage({ message: "   " }, "fb")).toBe("fb");
    });

    it("returns fallback when message is not a string", () => {
        expect(extractSuccessMessage({ message: 42 }, "fb")).toBe("fb");
    });

    it("returns fallback for null, undefined, or non-object values", () => {
        expect(extractSuccessMessage(null, "fb")).toBe("fb");
        expect(extractSuccessMessage(undefined, "fb")).toBe("fb");
        expect(extractSuccessMessage("raw", "fb")).toBe("fb");
    });
});
