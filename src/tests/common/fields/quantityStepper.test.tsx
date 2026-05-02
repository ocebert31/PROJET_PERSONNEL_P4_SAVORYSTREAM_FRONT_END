import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import QuantityStepper from "../../../common/fields/quantityStepper";

function noopStepperHandlers() {
  return {
    onIncrement: vi.fn(),
    onDecrement: vi.fn(),
    decreaseAriaLabel: "Diminuer la quantité",
    increaseAriaLabel: "Augmenter la quantité",
  };
}

describe("QuantityStepper", () => {
  describe("nominal case", () => {
    it("renders quantity and calls handlers when buttons are pressed", async () => {
      const onIncrement = vi.fn();
      const onDecrement = vi.fn();
      const user = userEvent.setup();

      render(
        <QuantityStepper
          quantity={4}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          decreaseAriaLabel="Diminuer la quantité"
          increaseAriaLabel="Augmenter la quantité"
        />,
      );

      expect(screen.getByText("4")).toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: "Augmenter la quantité" }));
      await user.click(screen.getByRole("button", { name: "Diminuer la quantité" }));
      expect(onIncrement).toHaveBeenCalledTimes(1);
      expect(onDecrement).toHaveBeenCalledTimes(1);
    });

    it("updates the displayed quantity when the quantity prop changes", () => {
      const handlers = noopStepperHandlers();
      const { rerender } = render(<QuantityStepper quantity={1} {...handlers} />);

      expect(screen.getByText("1")).toBeInTheDocument();

      rerender(<QuantityStepper quantity={99} {...handlers} />);

      expect(screen.getByText("99")).toBeInTheDocument();
      expect(screen.queryByText("1")).not.toBeInTheDocument();
    });

    it("displays zero and large quantities with tabular styling container", () => {
      const handlers = noopStepperHandlers();
      const { rerender } = render(<QuantityStepper quantity={0} {...handlers} />);

      const qtyZero = screen.getByText("0");
      expect(qtyZero).toHaveClass("tabular-nums");

      rerender(<QuantityStepper quantity={1000} {...handlers} />);

      expect(screen.getByText("1000")).toBeInTheDocument();
    });

    it("exposes group semantics when groupAriaLabel is set", () => {
      render(
        <QuantityStepper
          quantity={1}
          {...noopStepperHandlers()}
          decreaseAriaLabel="Minus"
          increaseAriaLabel="Plus"
          groupAriaLabel="Quantité pour Sauce A (250ml)"
        />,
      );

      expect(screen.getByRole("group", { name: "Quantité pour Sauce A (250ml)" })).toBeInTheDocument();
    });

    it("wraps controls in a bordered pill container", () => {
      const { container } = render(<QuantityStepper quantity={2} {...noopStepperHandlers()} />);

      const shell = container.firstElementChild;
      expect(shell).toHaveClass("inline-flex", "rounded-full", "border", "border-border", "bg-background");
    });
  });

  describe("quantityAriaLive", () => {
    it("does not set aria-live on the quantity span when quantityAriaLive is omitted", () => {
      render(<QuantityStepper quantity={2} {...noopStepperHandlers()} decreaseAriaLabel="M" increaseAriaLabel="P" />);

      expect(screen.getByText("2")).not.toHaveAttribute("aria-live");
    });

    it.each(["polite", "off", "assertive"] as const)("sets aria-live to %s when provided", (mode) => {
      render(<QuantityStepper quantity={5} {...noopStepperHandlers()} decreaseAriaLabel="M" increaseAriaLabel="P" quantityAriaLive={mode} />);

      expect(screen.getByText("5")).toHaveAttribute("aria-live", mode);
    });
  });

  describe("variations", () => {
    it("disables both steppers when disabled is true", () => {
      render(
        <QuantityStepper quantity={3} {...noopStepperHandlers()} decreaseAriaLabel="Minus" increaseAriaLabel="Plus" disabled />,
      );

      expect(screen.getByRole("button", { name: "Minus" })).toBeDisabled();
      expect(screen.getByRole("button", { name: "Plus" })).toBeDisabled();
    });

    it("does not call handlers when disabled", async () => {
      const onIncrement = vi.fn();
      const onDecrement = vi.fn();
      const user = userEvent.setup();

      render(
        <QuantityStepper
          quantity={3}
          {...noopStepperHandlers()}
          decreaseAriaLabel="Minus"
          increaseAriaLabel="Plus"
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          disabled
        />,
      );

      await user.click(screen.getByRole("button", { name: "Plus" }));
      await user.click(screen.getByRole("button", { name: "Minus" }));

      expect(onIncrement).not.toHaveBeenCalled();
      expect(onDecrement).not.toHaveBeenCalled();
    });

    it("does not use role group when groupAriaLabel is omitted", () => {
      render(<QuantityStepper quantity={1} {...noopStepperHandlers()} decreaseAriaLabel="M" increaseAriaLabel="P" />);

      expect(screen.queryByRole("group")).not.toBeInTheDocument();
    });
  });
});
