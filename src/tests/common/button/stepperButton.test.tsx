import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import StepperButton from "../../../common/button/stepperButton";

describe("StepperButton", () => {
  describe("nominal case", () => {
    it("renders as a button with default type", () => {
      render(<StepperButton aria-label="Increase quantity">+</StepperButton>);
      expect(screen.getByRole("button", { name: "Increase quantity" })).toHaveAttribute("type", "button");
    });

    it("applies stepper base classes", () => {
      render(<StepperButton aria-label="Increase quantity">+</StepperButton>);
      const el = screen.getByRole("button", { name: "Increase quantity" });
      expect(el.className).toContain("min-h-11");
      expect(el.className).toContain("hover:bg-primary");
    });
  });

  describe("variations", () => {
    it("merges custom className", () => {
      render(
        <StepperButton aria-label="Decrease quantity" className="custom-stepper">
          −
        </StepperButton>
      );
      expect(screen.getByRole("button", { name: "Decrease quantity" }).className).toContain("custom-stepper");
    });
  });
});
