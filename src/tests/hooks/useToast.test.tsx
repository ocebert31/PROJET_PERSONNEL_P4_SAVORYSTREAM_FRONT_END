import { describe, it, expect } from "vitest";
import type { ReactNode } from "react";
import { renderHook, render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useToast } from "../../hooks/useToast";
import { ToastProvider } from "../../common/toast/toastProvider";

function wrapper({ children }: { children: ReactNode }) {
    return <ToastProvider>{children}</ToastProvider>;
}

function TestConsumer() {
    const { showSuccess, showError } = useToast();
    return (
        <div>
            <button type="button" onClick={() => showSuccess("Success")}>
                success
            </button>
            <button type="button" onClick={() => showError("Failure")}>
                error
            </button>
        </div>
    );
}

describe("useToast", () => {
    it("returns no-op implementations that do not throw outside ToastProvider", () => {
        const { result } = renderHook(() => useToast());
        expect(() => {
            result.current.showSuccess("x");
            result.current.showError("y");
        }).not.toThrow();
    });

    it("does not show a toast when methods are called without a provider", async () => {
        render(
            <div>
                <TestConsumer />
            </div>,
        );
        await userEvent.click(screen.getByRole("button", { name: "success" }));
        expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    it("with ToastProvider, showSuccess displays a toast with role status", async () => {
        render(
            <ToastProvider>
                <TestConsumer />
            </ToastProvider>,
        );
        await userEvent.click(screen.getByRole("button", { name: "success" }));
        expect(await screen.findByRole("status")).toHaveTextContent("Success");
    });

    it("with ToastProvider, showError displays a toast with role alert", async () => {
        render(
            <ToastProvider>
                <TestConsumer />
            </ToastProvider>,
        );
        await userEvent.click(screen.getByRole("button", { name: "error" }));
        expect(await screen.findByRole("alert")).toHaveTextContent("Failure");
    });

    it("exposes the same API via renderHook with a wrapper", () => {
        const { result } = renderHook(() => useToast(), { wrapper });
        act(() => {
            result.current.showSuccess("Hook");
        });
        expect(screen.getByRole("status")).toHaveTextContent("Hook");
    });
});
