import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ToastStack } from "../../../common/Toast/ToastStack";

describe("ToastStack", () => {
    it("renders one ToastItemView per toast", () => {
        const onDismiss = vi.fn();
        render(
            <ToastStack
                toasts={[
                    { id: "a", variant: "success", message: "One" },
                    { id: "b", variant: "error", message: "Two" },
                ]}
                onDismiss={onDismiss}
            />,
        );
        expect(screen.getByText("One")).toBeInTheDocument();
        expect(screen.getByText("Two")).toBeInTheDocument();
        expect(screen.getByRole("status")).toBeInTheDocument();
        expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it("sets aria-live=polite on the container", () => {
        const { container } = render(<ToastStack toasts={[]} onDismiss={vi.fn()} />);
        expect(container.firstChild).toHaveAttribute("aria-live", "polite");
    });
});
