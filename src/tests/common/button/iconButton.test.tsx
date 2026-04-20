import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import IconButton from "../../../common/button/iconButton";

describe("IconButton", () => {
  describe("nominal case", () => {
    it("renders as a button with default type", () => {
      render(
        <IconButton aria-label="Close dialog">
          <span aria-hidden>×</span>
        </IconButton>
      );
      expect(screen.getByRole("button", { name: "Close dialog" })).toHaveAttribute("type", "button");
    });

    it("applies ghost variant classes by default", () => {
      render(
        <IconButton aria-label="Close dialog">
          <span aria-hidden>×</span>
        </IconButton>
      );
      expect(screen.getByRole("button", { name: "Close dialog" }).className).toContain("text-foreground/70");
    });
  });

  describe("variations", () => {
    it("applies subtle variant classes", () => {
      render(
        <IconButton variant="subtle" aria-label="Settings">
          <span aria-hidden>⚙</span>
        </IconButton>
      );
      expect(screen.getByRole("button", { name: "Settings" }).className).toContain("border-border");
    });

    it("applies destructive variant classes", () => {
      render(
        <IconButton variant="destructive" aria-label="Remove item">
          <span aria-hidden>×</span>
        </IconButton>
      );
      expect(screen.getByRole("button", { name: "Remove item" }).className).toContain("border-destructive-border");
    });

    it("applies medium size classes", () => {
      render(
        <IconButton size="md" aria-label="Zoom in">
          <span aria-hidden>+</span>
        </IconButton>
      );
      expect(screen.getByRole("button", { name: "Zoom in" }).className).toContain("h-10");
    });
  });
});
