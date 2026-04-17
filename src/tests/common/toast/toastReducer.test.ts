import { describe, it, expect } from "vitest";
import { toastReducer, MAX_TOASTS } from "../../../common/toast/toastReducer";
import type { ToastItem } from "../../../types/toast";

const item = (id: string, message: string): ToastItem => ({
    id,
    variant: "success",
    message,
});

describe("toastReducer", () => {
    it("ADD appends a toast to the list", () => {
        const next = toastReducer([], { type: "ADD", payload: item("a", "m") });
        expect(next).toEqual([item("a", "m")]);
    });

    it("REMOVE drops the toast with the given id", () => {
        const state = [item("a", "1"), item("b", "2")];
        const next = toastReducer(state, { type: "REMOVE", id: "a" });
        expect(next).toEqual([item("b", "2")]);
    });

    it("keeps at most MAX_TOASTS items (oldest are dropped)", () => {
        let state: ToastItem[] = [];
        for (let i = 0; i < 6; i++) {
            state = toastReducer(state, {
                type: "ADD",
                payload: item(`id-${i}`, `msg-${i}`),
            });
        }
        expect(state).toHaveLength(MAX_TOASTS);
        expect(state[0].id).toBe("id-1");
        expect(state[MAX_TOASTS - 1].id).toBe("id-5");
    });
});
