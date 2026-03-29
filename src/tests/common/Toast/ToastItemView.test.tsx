import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToastItemView } from "../../../common/Toast/ToastItemView";

describe("ToastItemView", () => {
    it("renders message with role=status for success variant", () => {
        const onDismiss = vi.fn();
        render(
            <ToastItemView
                toast={{ id: "1", variant: "success", message: "Well done" }}
                onDismiss={onDismiss}
            />,
        );
        const region = screen.getByRole("status");
        expect(region).toHaveTextContent("Well done");
    });

    it("uses role=alert for error variant", () => {
        const onDismiss = vi.fn();
        render(
            <ToastItemView
                toast={{ id: "2", variant: "error", message: "Error" }}
                onDismiss={onDismiss}
            />,
        );
        expect(screen.getByRole("alert")).toHaveTextContent("Error");
    });

    it("calls onDismiss with toast id when close button is clicked", async () => {
        const onDismiss = vi.fn();
        render(
            <ToastItemView
                toast={{ id: "abc-123", variant: "error", message: "x" }}
                onDismiss={onDismiss}
            />,
        );
        await userEvent.click(screen.getByRole("button", { name: /fermer la notification/i }));
        expect(onDismiss).toHaveBeenCalledTimes(1);
        expect(onDismiss).toHaveBeenCalledWith("abc-123");
    });
});
