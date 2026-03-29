import { describe, it, expect } from "vitest";
import { ToastContext } from "../../context/ToastContext";

describe("ToastContext", () => {
    it("exports a React context with Provider and Consumer", () => {
        expect(ToastContext).toBeDefined();
        expect(ToastContext.Provider).toBeDefined();
        expect(ToastContext.Consumer).toBeDefined();
    });
});
