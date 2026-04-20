import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ChipButton from "../../../common/button/chipButton";

describe("ChipButton", () => {
  describe("nominal case", () => {
    it("renders as a button with default type", () => {
      render(<ChipButton>250ml</ChipButton>);
      expect(screen.getByRole("button", { name: "250ml" })).toHaveAttribute("type", "button");
    });

    it("applies unselected styling by default", () => {
      render(<ChipButton>250ml</ChipButton>);
      const el = screen.getByRole("button", { name: "250ml" });
      expect(el.className).toContain("bg-background");
      expect(el.className).not.toContain("ring-2");
    });
  });

  describe("variations", () => {
    it("applies selected styling when selected is true", () => {
      render(
        <ChipButton selected>
          500ml
        </ChipButton>
      );
      const el = screen.getByRole("button", { name: "500ml" });
      expect(el.className).toContain("bg-primary");
      expect(el.className).toContain("ring-2");
    });

    it("disables interaction when disabled", () => {
      render(
        <ChipButton disabled>
          750ml
        </ChipButton>
      );
      expect(screen.getByRole("button", { name: "750ml" })).toBeDisabled();
    });
  });
});
