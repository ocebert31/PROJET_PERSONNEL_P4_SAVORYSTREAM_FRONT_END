import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Button from "../../../common/button/button";

describe("Button", () => {
  describe("nominal case", () => {
    it("renders as a button with default type", () => {
      render(<Button>Click</Button>);
      expect(screen.getByRole("button", { name: "Click" })).toHaveAttribute("type", "button");
    });

    it("applies the primary variant classes", () => {
      render(<Button variant="primary">Primary</Button>);
      expect(screen.getByRole("button", { name: "Primary" }).className).toContain("bg-primary");
    });
  });

  describe("variations", () => {
    it("applies the secondary variant classes", () => {
      render(<Button variant="secondary">Secondary</Button>);
      expect(screen.getByRole("button", { name: "Secondary" }).className).toContain("border-border");
    });

    it("applies the ghost variant classes", () => {
      render(<Button variant="ghost">Ghost</Button>);
      expect(screen.getByRole("button", { name: "Ghost" }).className).toContain("bg-transparent");
    });

    it("applies the destructive variant classes", () => {
      render(<Button variant="destructive">Delete</Button>);
      expect(screen.getByRole("button", { name: "Delete" }).className).toContain("bg-destructive");
    });

    it("applies size classes", () => {
      render(<Button size="lg">Large</Button>);
      expect(screen.getByRole("button", { name: "Large" }).className).toContain("px-8");
    });

    it("applies full width class when requested", () => {
      render(<Button fullWidth>Full</Button>);
      expect(screen.getByRole("button", { name: "Full" }).className).toContain("w-full");
    });
  });
});
