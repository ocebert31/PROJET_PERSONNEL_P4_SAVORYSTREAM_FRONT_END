import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { FormSection } from "../../../../components/Dashboard/Sauce/FormSection";

describe("FormSection", () => {
  describe("nominal case", () => {
    it("renders title and children", () => {
      render(
        <FormSection title="Stock">
          <p>Child content</p>
        </FormSection>,
      );
      expect(screen.getByRole("heading", { name: "Stock" })).toBeInTheDocument();
      expect(screen.getByText("Child content")).toBeInTheDocument();
    });
  });

  describe("variations", () => {
    it("renders empty children without crashing", () => {
      render(<FormSection title="Empty" />);
      expect(screen.getByRole("heading", { name: "Empty" })).toBeInTheDocument();
    });
  });
});
