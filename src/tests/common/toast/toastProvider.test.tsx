import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToastProvider } from "../../../common/toast/toastProvider";
import { useToast } from "../../../hooks/useToast";

function DismissDemo() {
    const { showSuccess } = useToast();
    return (
        <button type="button" onClick={() => showSuccess("To dismiss")}>
            show
        </button>
    );
}

describe("ToastProvider", () => {
    it("renders its children", () => {
        render(
            <ToastProvider>
                <span data-testid="child">child</span>
            </ToastProvider>,
        );
        expect(screen.getByTestId("child")).toHaveTextContent("child");
    });

    it("removes the toast when the close button is clicked", async () => {
        render(
            <ToastProvider>
                <DismissDemo />
            </ToastProvider>,
        );
        await userEvent.click(screen.getByRole("button", { name: "show" }));
        expect(await screen.findByRole("status")).toHaveTextContent("To dismiss");
        await userEvent.click(screen.getByRole("button", { name: /fermer la notification/i }));
        expect(screen.queryByText("To dismiss")).not.toBeInTheDocument();
    });

    describe("auto-dismiss", () => {
        beforeEach(() => {
            vi.useFakeTimers();
        });
        afterEach(() => {
            vi.useRealTimers();
        });

        it("removes the toast after AUTO_DISMISS_MS", () => {
            render(
                <ToastProvider>
                    <DismissDemo />
                </ToastProvider>,
            );
            fireEvent.click(screen.getByRole("button", { name: "show" }));
            expect(screen.getByRole("status")).toBeInTheDocument();

            act(() => {
                vi.advanceTimersByTime(5000);
            });

            expect(screen.queryByRole("status")).not.toBeInTheDocument();
        });
    });
});
